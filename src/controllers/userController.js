import User from "../models/User.js";
import Video from "../models/Video.js";
import bcrypt from "bcrypt";
import fetch from "node-fetch";

export const getJoin = (req, res) => {
  res.render("join", { pageTitle: "JOIN" });
};
export const postJoin = async (req, res) => {
  const {
    body: { email, username, password, password2 },
    file,
  } = req;
  const pageTitle = "JOIN";
  if (password !== password2)
    return res
      .status(400)
      .render("join", { pageTitle, errorMessage: "Not same password" });
  const isExist = await User.exists({ email });
  if (isExist)
    return res
      .status(400)
      .render("join", { pageTitle, errorMessage: "Existed Email" });
  try {
    await User.create({
      email,
      username,
      password,
      avatarUrl: file ? file.path : "",
    });
    return res.redirect("/login");
  } catch (error) {
    return res
      .status(400)
      .render("join", { pageTitle, errorMessage: error._message });
  }
};
export const getLogin = (req, res) => {
  res.render("login", { pageTitle: "LOGIN" });
};
export const postLogin = async (req, res) => {
  const { email, password } = req.body;
  const pageTitle = "LOGIN";
  const user = await User.findOne({ email });
  if (!user)
    return res
      .status(400)
      .render("login", { pageTitle, errorMessage: "Invalid Account" });
  const ok = await bcrypt.compare(password, user.password);
  if (!ok)
    return res
      .status(400)
      .render("login", { pageTitle, errorMessage: "Confirm Password" });
  req.session.loggedIn = true;
  req.session.user = user;
  return res.redirect("/");
};

export const logout = (req, res) => {
  req.session.destroy();
  return res.redirect("/");
};

export const getEdit = (req, res) => {
  return res.render("edit-profile", { pageTitle: "Edit-profile" });
};
export const postEdit = async (req, res) => {
  const {
    session: {
      user: { _id, avatarUrl },
    },
    body: { email, username, name },
    file,
  } = req;
  const existEmail = await User.exists({ email });
  const pageTitle = "Edit-profile";

  if (email !== req.session.user.email) {
    if (existEmail)
      return res
        .status(400)
        .render("edit-profile", { pageTitle, errorMessage: "Existed email" });
  }
  const updatedUser = await User.findByIdAndUpdate(
    _id,
    {
      email,
      name,
      username,
      avatarUrl: file ? file.path : avatarUrl,
    },
    { new: true }
  );
  req.session.user = updatedUser;
  return res.redirect("/users/edit-profile");
};
export const startGithubLogin = (req, res) => {
  const baseUrl = "https://github.com/login/oauth/authorize";
  const config = {
    client_id: process.env.GH_CLIENT,
    allow_signup: false,
    scope: "read:user user:email",
  };
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;
  return res.redirect(finalUrl);
};
export const finishGithubLogin = async (req, res) => {
  const baseUrl = "https://github.com/login/oauth/access_token";
  const config = {
    client_id: process.env.GH_CLIENT,
    client_secret: process.env.GH_SECRET,
    code: req.query.code,
    //github이 redirect한 url에 code, client_id 있음
    //url에 있는 값은 req.query로 접근
  };
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;
  //post 요청을 보내서 access token 으로 교환
  const tokenRequest = await (
    await fetch(finalUrl, {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
    })
  ).json();
  if ("access_token" in tokenRequest) {
    const apiUrl = "https://api.github.com";
    const { access_token } = tokenRequest;
    const userData = await (
      await fetch(`${apiUrl}/user`, {
        headers: {
          Authorization: `token ${access_token}`,
        },
      })
    ).json();
    const emailData = await (
      await fetch(`${apiUrl}/user/emails`, {
        headers: {
          Authorization: `token ${access_token}`,
        },
      })
    ).json();
    const emailObj = emailData.find(
      (email) => email.primary === true && email.verified === true
    );
    if (!emailObj) {
      return res.redirect("/login");
    }
    let user = await User.findOne({ email: emailObj.email });
    if (!user) {
      //user 생성 but 소셜 로그인은 비번x
      user = await User.create({
        email: emailObj.email,
        socialOnly: true,
        avatarUrl: userData.avatar_url,
        username: userData.login,
        password: "",
        name: userData.name,
      });
    }
    req.session.loggedIn = true;
    req.session.user = user;
    return res.redirect("/");
  } else {
    return res.redirect("/login");
  }
};
export const getChangePassword = (req, res) => {
  if (req.session.user.socialOnly) return res.redirect("/");
  return res.render("change-password", { pageTitle: "Change Password" });
};
export const postChangePassword = async (req, res) => {
  const {
    session: {
      user: { _id },
    },
    body: { oldPassword, newPassword, newPassword2 },
  } = req;
  const pageTitle = "Change Password";
  if (newPassword !== newPassword2)
    return res
      .status(400)
      .render("change-password", { pageTitle, errorMessage: "Not same Input" });
  const loggedInUser = await User.findById(_id);
  const ok = await bcrypt.compare(oldPassword, loggedInUser.password);
  if (!ok)
    return res.status(400).render("change-password", {
      pageTitle,
      errorMessage: "Confirm Your Current Password",
    });
  if (oldPassword === newPassword)
    return res.status(400).render("change-password", {
      pageTitle,
      errorMessage: "Input Different Value",
    });
  loggedInUser.password = newPassword;
  await loggedInUser.save();
  req.session.destroy();
  return res.redirect("/");
};
export const showProfile = async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id).populate("videos");
  if (!user) {
    return res.render("404", {
      pageTitle: "ERROR",
      errorMessage: "Page Not Found",
    });
  }
  return res.render("profile", { pageTitle: user.username, user });
};

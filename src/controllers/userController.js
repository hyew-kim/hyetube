import User from "../models/User";
import bcrypt from "bcrypt";

export const getJoin = (req, res) => {
  res.render("join", { pageTitle: "JOIN" });
};
export const postJoin = async (req, res) => {
  const { email, socialOnly, avatarUrl, username, password, password2 } =
    req.body;
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

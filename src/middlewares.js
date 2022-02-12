import session from "express-session";
import multer from "multer";

export const localMiddleware = (req, res, next) => {
  res.locals.loggedIn = Boolean(req.session.loggedIn);
  res.locals.siteName = "HYETUBE";
  res.locals.loggedInUser = req.session.user || {};
  next();
};
//자격없는 계정의 url 접근 방지
export const protectorMiddleware = (req, res, next) => {
  if (req.session.loggedIn) return next();
  else res.redirect("/login");
};

//비회원 접근용
export const publicOnlyMiddleware = (req, res, next) => {
  if (!req.session.loggedIn) return next();
  else res.redirect("/");
};

export const avatarUpload = multer({
  dest: "uploads/avatars/",
  limits: {
    fileSize: 1 * 1024 * 1024,
  },
});

export const videoUpload = multer({
  dest: "uploads/videos/",
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

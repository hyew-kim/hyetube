import multer from "multer";

export const videoUpload = multer({
  dest: "uploads/videos/",
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

import Video from "../models/Video";

export const home = async (req, res) => {
  const videos = await Video.find({}).sort({ createAt: -1 });
  return res.render("home", { pageTitle: "Home", videos });
};

export const watch = (req, res) => {
  return res.render("watch");
};
export const getUpload = (req, res) => {
  return res.render("upload", { pageTitle: "Upload" });
};
export const postUpload = async (req, res) => {
  const {
    body: { title, description, hashtags },
    file: { path: fileUrl },
  } = req;
  try {
    await Video.create({
      title,
      description,
      hashtags: Video.formatHashtags(hashtags),
      fileUrl,
      createAt: new Date().toISOString().substring(0, 10),
    });
    return res.redirect("/");
  } catch (error) {
    console.log(error);
    return res.status(400).render("upload", {
      pageTitle: "Upload",
      errorMessage: error._message,
    });
  }
};
export const getEdit = (req, res) => {
  res.render("edit");
};
export const postEdit = (req, res) => {
  res.redirect("/");
};

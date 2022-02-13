import Video from "../models/Video";
import User from "../models/User";
import Comment from "../models/Comment";

export const home = async (req, res) => {
  const videos = await Video.find({}).populate("owner").sort({ createAt: -1 });
  return res.render("home", { pageTitle: "HOME", videos });
};

export const watch = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id).populate("owner").populate("comments");
  if (!video)
    return res.status(404).render("404", { errorMessage: "Video Not Found" });
  return res.render("watch", { pageTitle: "WATCH", video });
};

export const getUpload = (req, res) => {
  return res.render("upload", { pageTitle: "UPLOAD" });
};
export const postUpload = async (req, res) => {
  const {
    session: {
      user: { _id },
    },
    body: { title, description, hashtags },
    file: { path: fileUrl },
  } = req;
  try {
    const newVideo = await Video.create({
      title,
      description,
      hashtags: Video.formatHashtags(hashtags),
      fileUrl,
      createAt: new Date().toISOString().substring(0, 10),
      owner: _id,
    });
    const user = await User.findById(_id);
    user.videos.push(newVideo._id);
    user.save();
    return res.redirect("/");
  } catch (error) {
    return res
      .status(400)
      .render("upload", { pageTitle: "UPLOAD", errorMessage: error._message });
  }
};
export const getEdit = async (req, res) => {
  const {
    params: { id },
  } = req;
  const { _id } = req.session.user || "";
  const video = await Video.findById(id);
  if (!video)
    return res
      .status(404)
      .render("404", { pageTitle: "ERROR", errorMessage: "Video Not Found" });
  if (String(video.owner) !== String(_id)) return res.status(403).redirect("/");
  return res.render("edit", { pageTitle: "EDIT", video });
};
export const postEdit = async (req, res) => {
  const { id } = req.params;
  const { _id } = req.session.user || "";
  const { title, description, hashtags } = req.body;
  const video = await Video.findOne({ _id: id });
  if (!video)
    return res
      .status(404)
      .render("404", { pageTitle: "ERROR", errorMessage: "Video Not Found" });
  if (String(video.owner) !== String(_id)) return res.status(403).redirect("/");
  try {
    await Video.findByIdAndUpdate(id, {
      title,
      description,
      hashtags: Video.formatHashtags(hashtags),
    });
    return res.redirect(`/videos/${id}`);
  } catch (error) {
    return res
      .status(400)
      .render("edit", { pageTitle: "EDIT", errorMessage: error._message });
  }
};
export const remove = async (req, res) => {
  const { id } = req.params;
  const { _id } = req.session.user || "";
  const video = await Video.findById(id);
  const user = await User.findById(_id);
  if (!video)
    return res
      .status(404)
      .render("404", { pageTitle: "ERROR", errorMessage: "Video Not Found" });
  if (String(video.owner) !== String(_id)) return res.status(403).redirect("/");
  await Video.findByIdAndDelete(id);
  user.videos.splice(user.videos.indexOf(id), 1);
  user.save();
  return res.redirect("/");
};
export const search = async (req, res) => {
  const { keyword } = req.query;
  let videos = [];
  if (keyword) {
    videos = await Video.find({
      title: {
        $regex: new RegExp(keyword, "i"),
      },
    }).populate("owner");
  }
  return res.render("search", { pageTitle: "Search", videos });
};
export const createComment = async (req, res) => {
  const {
    params: { id },
    body: { text },
    session: { user },
  } = req;
  const video = await Video.findById(id);
  if (!video) return res.sendStatus(404);
  const comment = await Comment.create({
    text,
    owner: user._id,
    video: id,
  });
  video.comments.push(comment._id);
  video.save();
  return res.status(201).json({ newCommentId: comment._id });
};
export const deleteComment = async (req, res) => {
  const {
    params: { id }, //comment id
    session: {
      user: { _id }, // remove시도하는 id
    },
  } = req;
  const comment = await Comment.findById(id);
  if (!comment) return res.sendStatus(404);
  if (String(comment.owner) === String(_id)) {
    const video = await Video.findById(comment.video);
    if (!video) return res.sendStatus(404);
    await Comment.deleteOne({ _id: id });
    video.comments.splice(video.comments.indexOf(id), 1);
    video.save();
    return res.sendStatus(200);
  } else return res.sendStatus(403);
};

import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  createAt: { type: String },
  hashtags: [{ type: String }],
  fileUrl: { type: String, required: true, trim: true },
});

const Video = mongoose.model("Video", videoSchema);
export default Video;

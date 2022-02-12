import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  createAt: { type: String },
  hashtags: [{ type: String }],
  owner: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
  fileUrl: { type: String, required: true, trim: true },
  meta: {
    views: { type: Number, default: 0, required: true },
  },
});

videoSchema.static("formatHashtags", function (hashtags) {
  return hashtags
    .split(",")
    .map((word) =>
      word.trim().startsWith("#") ? word.trim() : `#${word.trim()}`
    );
});
const Video = mongoose.model("Video", videoSchema);
export default Video;

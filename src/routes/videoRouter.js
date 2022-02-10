import express from "express";
import {
  getEdit,
  getUpload,
  postEdit,
  postUpload,
  remove,
  watch,
} from "../controllers/videoController";
import { videoUpload } from "../middlewares";

const videoRouter = express.Router();

videoRouter
  .route("/upload")
  .get(getUpload)
  .post(videoUpload.single("video"), postUpload);
videoRouter.get("/:id", watch);
videoRouter.route("/:id/edit").get(getEdit).post(postEdit);
videoRouter.get("/:id/remove", remove);
export default videoRouter;

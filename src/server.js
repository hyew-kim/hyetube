import express from "express";
import rootRouter from "./routes/rootRouter";
import userRouter from "./routes/userRouter";
import videoRouter from "./routes/videoRouter";

const app = express();

export default app;

app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views");

app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static("uploads"));
app.use("/static", express.static("assets"));

app.use("/", rootRouter);
app.use("/users", userRouter);
app.use("/videos", videoRouter);

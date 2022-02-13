import express from "express";
import session from "express-session";
import MongoStore from "connect-mongo";
import rootRouter from "./routes/rootRouter.js";
import userRouter from "./routes/userRouter.js";
import videoRouter from "./routes/videoRouter.js";
import { localMiddleware } from "./middlewares.js";
import apiRouter from "./routes/apiRouter.js";

const app = express();

export default app;

app.set("view engine", "pug");
//process.cwd(): package.json이 있는 root
app.set("views", process.cwd() + "/src/views");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.DB_URL }),
  })
);
app.use(localMiddleware);
app.use("/uploads", express.static("uploads"));
app.use("/static", express.static("assets"));

app.use("/", rootRouter);
app.use("/users", userRouter);
app.use("/videos", videoRouter);
app.use("/api", apiRouter);

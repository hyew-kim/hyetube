import express from "express";
import session from "express-session";
import MongoStore from "connect-mongo";
import rootRouter from "./routes/rootRouter";
import userRouter from "./routes/userRouter";
import videoRouter from "./routes/videoRouter";
import { localMiddleware } from "./middlewares";
import apiRouter from "./routes/apiRouter";

const app = express();

export default app;

app.set("view engine", "pug");
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

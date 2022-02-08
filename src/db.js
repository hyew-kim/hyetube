import mongoose from "mongoose";

mongoose.connect("mongodb://127.0.0.1:27017/hyetube");

const db = mongoose.connection;
const handleOpen = () => console.log("✅ connected to DB");
const handleError = () => console.log("❌ DB error");
db.on("error", handleError);
db.once("open", handleOpen);

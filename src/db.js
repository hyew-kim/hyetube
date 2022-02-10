import mongoose from "mongoose";

mongoose.connect(process.env.DB_URL);

const db = mongoose.connection;
const handleOpen = () => console.log("✅ connected to DB");
const handleError = () => console.log("❌ DB error");
db.on("error", handleError);
db.once("open", handleOpen);

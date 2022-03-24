import "regenerator-runtime";
import "dotenv/config";
import "./db.js";
import "./models/Video.js";
import "./models/User.js";
import "./models/Comment.js";
import app from "./server.js";

const PORT = process.env.PORT || 4000;

app.listen(PORT, () =>
  console.log(`✅ Server Listening http://localhost:${PORT}`)
);

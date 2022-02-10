import "dotenv/config";
import "./db";
import "./models/Video";
import "./models/User";
import app from "./server.js";

const PORT = 4000;

app.listen(PORT, () =>
  console.log(`✅ Server Listening http://localhost:${PORT}`)
);

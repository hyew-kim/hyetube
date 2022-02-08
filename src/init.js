import "./db";
import express from "express";
import app from "./server.js";

const PORT = 4000;

app.listen(PORT, () =>
  console.log(`✅ Server Listening http://localhost:${PORT}`)
);

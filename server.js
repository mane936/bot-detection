const express = require("express");
const app = express();
const path = require("path");

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + "/index.html")); //eslint-disable-line
});
app.get("/index.js", (req, res) => {
  res.sendFile(path.join(__dirname + "/index.js")); //eslint-disable-line
});

app.listen("3000", () => {
  console.log("Listening to port 3000...");
});

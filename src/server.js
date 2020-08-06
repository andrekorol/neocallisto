const bodyParser = require("body-parser");
const cors = require("cors");
const express = require("express");
const path = require("path");
const { initDB } = require("./database");
const http = require("http");
initDB();

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, "../build")));
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../build/index.html"));
});

const port = process.env.PORT || 5000;
http.createServer(app).listen(port);
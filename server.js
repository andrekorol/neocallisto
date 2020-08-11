const bodyParser = require("body-parser");
const cors = require("cors");
const express = require("express");
const path = require("path");
const { initDB } = require("./src/server/database");
const http = require("http");
const history = require("connect-history-api-fallback");
const { getSeed } = require("./src/server/password");
const users = require("./src/api/users");

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

initDB();

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(history());
app.use("/api/users", users);

app.use(express.static(path.join(__dirname, "build")));
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "build/index.html"));
});

app.get("/admin/sitekey", (_, res) => {
  res.status(200).send(process.env.HCAPTCHA_SITEKEY);
});

app.get("/admin/seed", (req, res) => {
  getSeed()
    .then((buf) => {
      res.status(200).send(buf);
    })
    .catch(() => {
      res.status(500).send("Error generating random seed");
    });
});

const port = process.env.PORT || 5000;
http.createServer(app).listen(port);

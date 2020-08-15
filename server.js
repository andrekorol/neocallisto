const bodyParser = require("body-parser");
const cors = require("cors");
const express = require("express");
const path = require("path");
const { initDB } = require("./src/server/database");
const http = require("http");
const history = require("connect-history-api-fallback");
const users = require("./src/api/users");
const admin = require("./src/api/admin");

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

initDB();

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(history());
app.use("/api/users", users);
app.use("/admin", admin);

app.use(express.static(path.join(__dirname, "build")));
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "build/index.html"), function (err) {
    if (err) {
      res.status(500).send(err);
    }
  });
});

const port = process.env.PORT || 5000;
http.createServer(app).listen(port);

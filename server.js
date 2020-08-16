const bodyParser = require("body-parser");
const cors = require("cors");
const express = require("express");
const path = require("path");
const { initDB } = require("./src/server/database");
const history = require("connect-history-api-fallback");
const users = require("./src/api/users");
const admin = require("./src/api/admin");

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

initDB();

const port = process.env.PORT || 5000;

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(history());

app.use("/api/users", users);
app.use("/api/admin", admin);

app.use(express.static(path.join(__dirname, "build")));
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "build/index.html"), function (err) {
    if (err) {
      res.status(500).send(err);
    }
  });
});

app
  .listen(port, () => {
    console.log(`Server started on port ${port}`);
  })
  .on("error", (err) => {
    console.error(err);
  });

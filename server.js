const bodyParser = require("body-parser");
const cors = require("cors");
const express = require("express");
const path = require("path");
const { initDB } = require("./src/server/database");
const history = require("connect-history-api-fallback");
const users = require("./src/api/users");
const admin = require("./src/api/admin");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const Redis = require("ioredis");
const RedisStore = require("connect-redis")(session);
const http = require("http");
const https = require("https");
const { readFileSync, fstat } = require("fs");

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const redis = new Redis(process.env.REDIS_URL);

// Connect to the MongoDB instance
initDB();

const app = express();
app.set("trust proxy", true);
app.use(cors());
app.use(cookieParser(process.env.COOKIE_SIGN_SECRET));
app.use(bodyParser.json());
app.use(history());

app.use(
  session({
    secret: process.env.COOKIE_SIGN_SECRET,
    name: "neocallisto-session",
    cookie: {
      httpOnly: true,
      secure: true,
      sameSite: true,
    },
    store: new RedisStore({ client: redis }),
    resave: false,
    saveUninitialized: false,
  })
);

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

const sslOptions = {
  key: readFileSync("privkey.pem"),
  cert: readFileSync("certificate.pem"),
};

https.createServer(sslOptions, app).listen(443);
http.createServer(app).listen(80);

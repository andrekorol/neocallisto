const bodyParser = require("body-parser");
const cors = require("cors");
const express = require("express");
const path = require("path");
const { initDB } = require("./src/server/database");
const history = require("connect-history-api-fallback");
const users = require("./src/api/users");
const admin = require("./src/api/admin");
const callisto = require("./src/api/callisto");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const Redis = require("ioredis");
const SessionRedisStore = require("connect-redis")(session);
const rateLimit = require("express-rate-limit");
const RateLimitRedisStore = require("rate-limit-redis");
const csurf = require("csurf");
const helmet = require("helmet");

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
    store: new SessionRedisStore({ client: redis }),
    resave: false,
    saveUninitialized: false,
  })
);

// Automatically set HTTP headers to improve the application security
app.use(helmet());

// Apply rate limiting to API requests
const apiRateLimitWindow = 15 * 60; // 15 minutes, in seconds
const apiLimiter = rateLimit({
  store: new RateLimitRedisStore({
    client: redis,
    expiry: apiRateLimitWindow,
    prefix: "api-rl",
  }),
  windowMs: apiRateLimitWindow * 1000,
  max: 100, // limit each IP to 100 requests per windowMs (15 minutes)
});
app.use("/api/", apiLimiter);

// Set-up API endpoints
app.use("/api/users", users);
app.use("/api/admin", admin);
app.use("/api/callisto", callisto);

// Apply rate limiting to non-API requests
const staticRateLimitWindow = 60; // 1 minute, in seconds
const staticLimiter = rateLimit({
  store: new RateLimitRedisStore({
    client: redis,
    expiry: staticRateLimitWindow,
    prefix: "static-rl",
  }),
  windowMs: staticRateLimitWindow * 1000,
  max: 100,
});
app.use(staticLimiter);

app.use(express.static(path.join(__dirname, "build")));
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "build/index.html"), function (err) {
    if (err) {
      res.status(500).send(err);
    }
  });
});

const port = process.env.PORT || 5000;

app
  .listen(port, () => {
    console.log(`Server started on port ${port}`);
  })
  .on("error", (err) => {
    console.error(err);
  });

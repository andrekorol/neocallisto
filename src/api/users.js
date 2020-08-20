const express = require("express");
const User = require("../models/user");
const { getPsswdHash, genericHash } = require("../server/password");
const { verify } = require("hcaptcha");
const { timingSafeEqual } = require("crypto");

const router = express.Router();

router.post("/register", (req, res) => {
  const { email, name, username, captcha } = req.body;
  const password = new Uint8Array(Object.values(req.body.password));
  let salt = new Uint8Array(Object.values(req.body.salt));

  getPsswdHash(password, salt).then((hash) => {
    salt = Buffer.from(salt.buffer);
    hash = Buffer.from(hash.buffer);
    const newUser = new User({ email, name, username, salt, hash });
    newUser
      .save()
      .then(() => {
        res.json({
          message: "Created account successfully",
        });
      })
      .catch((err) => {
        res.status(400).json({
          message: "Error creating account.",
          error: err,
        });
      });
  });
  verify(process.env.HCAPTCHA_SECRETKEY, captcha)
    .then((data) => console.log("Success verifying HCaptcha token", data))
    .catch(console.error);
});

router.post("/seed", (req, res) => {
  const { emailOrUsername } = req.body;
  User.findOne(
    { $or: [{ email: emailOrUsername }, { username: emailOrUsername }] },
    "salt",
    (err, user) => {
      if (err) {
        res.status(500).json(JSON.stringify(err));
        return;
      }
      if (!user) {
        genericHash(emailOrUsername).then((seed) => {
          res.json({ seed });
        });
      } else {
        const seed = new Uint8Array(user.salt);
        res.json({ seed });
      }
    }
  );
});

router.post("/login", (req, res) => {
  const password = new Uint8Array(Object.values(req.body.password));
  const salt = new Uint8Array(Object.values(req.body.salt));
  const authenticationErrorMsg = "Invalid username or password";

  getPsswdHash(password, salt).then((hash) => {
    const { emailOrUsername } = req.body;
    User.findOne(
      {
        $or: [
          {
            email: emailOrUsername,
          },
          {
            username: emailOrUsername,
          },
        ],
      },
      "hash",
      (err, user) => {
        if (err) {
          res.status(500).json(JSON.stringify(err));
          return;
        }
        if (!user) {
          res.status(401).send(authenticationErrorMsg);
          return;
        }
        const storedHash = new Uint8Array(user.hash);
        if (timingSafeEqual(hash, storedHash)) {
          req.session.user = user._id;
          res.sendStatus(200);
        } else {
          res.status(401).send(authenticationErrorMsg);
        }
      }
    );
  });
});

module.exports = router;

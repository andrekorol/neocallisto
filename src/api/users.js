const express = require("express");
const User = require("../models/user");
const { getHash } = require("../server/password");
const { verify } = require("hcaptcha");

const router = express.Router();

router.post("/register", (req, res) => {
  let { email, name, username, password, salt, captcha } = req.body;
  password = Uint8Array.from(Object.values(password));
  salt = Uint8Array.from(Object.values(salt));
  getHash(password, salt).then((hash) => {
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

module.exports = router;

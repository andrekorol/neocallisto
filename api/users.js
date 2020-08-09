const express = require("express");
const User = require("../src/models/user");
const { getHash } = require("../server/password");

const router = express.Router();

router.get("/", (_, res) => {
  User.find()
    .then((users) => res.json(users))
    .catch((err) => console.error(err));
});

router.post("/", (req, res) => {
  let { email, name, username, password, salt } = req.body;
  password = Uint8Array.from(Object.values(password));
  salt = Uint8Array.from(Object.values(salt));
  getHash(password, salt).then((hash) => {
    salt = Buffer.from(salt.buffer);
    hash = Buffer.from(hash.buffer);
    const newUser = new User({ email, name, username, salt, hash });
    newUser
      .save()
      .then(() =>
        res.json({
          message: "Created account successfully",
        })
      )
      .catch((err) =>
        res.status(400).json({
          error: err,
          message: "Error creating account",
        })
      );
  });
});

module.exports = router;

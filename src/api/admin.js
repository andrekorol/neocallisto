const express = require("express");
const { getSeed } = require("../server/password");

const router = express.Router();

router.get("/sitekey", (_, res) => {
  res.status(200).send(process.env.HCAPTCHA_SITEKEY);
});

router.get("/seed", (_, res) => {
  getSeed()
    .then((buf) => {
      res.status(200).send(buf);
    })
    .catch(() => {
      res.status(500).send("Error generating random seed");
    });
});

module.exports = router;

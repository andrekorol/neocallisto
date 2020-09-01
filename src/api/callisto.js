const express = require("express");
const router = express.Router();
const fetch = require("node-fetch");
const cheerio = require("cheerio");

router.post("/check-date", async (req, res) => {
  const callistoServerURL =
    "http://soleil.i4ds.ch/solarradio/data/2002-20yy_Callisto";
  const { formattedDate } = req.body;
  const callistoDateURL = `${callistoServerURL}/${formattedDate}`;

  try {
    const response = await fetch(callistoDateURL);
    const body = await response.text();
    const $ = cheerio.load(body);
    const respTitle = $("title")[0].children[0].data;
    if (respTitle === "404 Not Found") {
      res.sendStatus(404);
      return;
    }
    res.sendStatus(200);
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;

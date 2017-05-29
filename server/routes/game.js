const express = require("express");
const router = express.Router();
const path = require("path");
const ua = require('universal-analytics');

router.get("/:gameID", function getGame(req, res) {
  const visitor = ua(process.env.GOOGLE_ANALYTICS_ID);
  visitor.event("game-play", "reload-game").send();
  res.sendFile(path.join(__dirname + "/../../build/index.html"));
});

module.exports = router;

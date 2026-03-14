const express = require("express");
const router = express.Router();
const { addHuman, getHumans } = require("../services/humanService");

router.post("/humans/detect", (req, res) => {
  const { latitude, longitude } = req.body;

  const human = addHuman(latitude, longitude);

  res.json({
    message: "Human detected",
    human
  });
});

router.get("/humans", (req, res) => {
  res.json(getHumans());
});

module.exports = router;
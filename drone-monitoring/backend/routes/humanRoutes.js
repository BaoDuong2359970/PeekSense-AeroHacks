const express = require("express");
const router = express.Router();

const { handleHumanDetection, respondToAssistanceCheck } = require("../controllers/humanController");
const { createHumanDetection, getHumans } = require("../services/detection/humanService");
const { getIncidents } = require("../services/stores/humanStore");

router.post("/detections/human", handleHumanDetection);

router.get("/incidents", (req, res) => {
  res.json(getIncidents());
});

router.post("/assistance-checks/:id/response", respondToAssistanceCheck);

router.post("/humans/detect", (req, res) => {
  const io = req.app.get("io");
  const human = createHumanDetection(req.body);

  io.emit("human_detected", human);

  res.json({
    message: "Human detected",
    human
  });
});

router.get("/humans", (req, res) => {
  res.json(getHumans());
});

module.exports = router;
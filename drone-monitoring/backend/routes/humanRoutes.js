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

// const { addHuman, getHumans } = require("../services/humanService");

// router.post("/humans/detect", (req, res) => {
//   const { latitude, longitude } = req.body;

//   const human = addHuman(latitude, longitude);

//   res.json({
//     message: "Human detected",
//     human
//   });
// });

// router.get("/humans", (req, res) => {
//   res.json(getHumans());
// });

module.exports = router;
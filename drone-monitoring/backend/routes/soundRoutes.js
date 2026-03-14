const express = require("express");
const router = express.Router();

const { classifySoundThreat } = require("../services/soundEventService");
const { addAlert } = require("../services/alertService");

router.post("/sound/analyze", (req, res) => {
  const { label, confidence, latitude, longitude } = req.body;

  const threat = classifySoundThreat({ label, confidence });

  let alert = null;

  if (threat) {
    alert = addAlert({
      category: "acoustic_threat",
      type: threat.type,
      severity: threat.severity,
      message: threat.message,
      timestamp: new Date(),
      details: {
        sound: label,
        confidence,
        latitude,
        longitude
      }
    });
  }

  res.json({
    prediction: { label, confidence },
    alert
  });
});

module.exports = router;
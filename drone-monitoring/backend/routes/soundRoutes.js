const express = require("express");
const router = express.Router();

const { classifySoundThreat } = require("../services/detection/soundEventService");
const { addAlert } = require("../services/infrastructure/alertService");

router.post("/sound/analyze", (req, res) => {
  const io = req.app.get("io");
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
      location: { latitude, longitude },
      details: {
        sound: label,
        confidence,
        latitude,
        longitude
      }
    });

    io.emit("alert_created", alert);
  }

  res.json({
    prediction: { label, confidence },
    alert
  });
});

module.exports = router;
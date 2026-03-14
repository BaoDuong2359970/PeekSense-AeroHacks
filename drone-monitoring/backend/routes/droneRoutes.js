const express = require("express");
const router = express.Router();

// Temporary drone state
let droneState = {
  droneId: "drone-01",
  latitude: 0,
  longitude: 0,
  battery: 100,
  status: "patrolling",
  timestamp: null
};

// update drone telemetry
router.post("/drone/telemetry", (req, res) => {

  const { latitude, longitude, battery, status } = req.body;

  droneState = {
    droneId: "drone-01",
    latitude,
    longitude,
    battery,
    status,
    timestamp: new Date()
  };

  res.json({
    message: "Telemetry updated",
    droneState
  });
});

// get drone state
router.get("/drone/state", (req, res) => {
  res.json(droneState);
});

module.exports = router;
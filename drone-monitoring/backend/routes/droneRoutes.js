const express = require("express");
const router = express.Router();
const { droneState } = require("../services/droneSimulator");

// get current drone state
router.get("/drone/state", (req, res) => {
  res.json(droneState);
});

// optional manual telemetry update
router.post("/drone/telemetry", (req, res) => {
  const { latitude, longitude, battery, status } = req.body;

  if (latitude !== undefined) droneState.latitude = latitude;
  if (longitude !== undefined) droneState.longitude = longitude;
  if (battery !== undefined) droneState.battery = battery;
  if (status !== undefined) droneState.status = status;

  droneState.timestamp = new Date();

  res.json({
    message: "Telemetry updated",
    droneState
  });
});

module.exports = router;
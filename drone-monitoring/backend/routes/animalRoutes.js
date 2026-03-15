const express = require("express");
const router = express.Router();

const { addAnimalDetection, getAnimals } = require("../services/detection/animalService");
const { checkAnimalProximity } = require("../services/analysis/proximityService");
const { buildAnimalProximityAlert } = require("../services/analysis/threatAlertService");
const { generateHumanWarning } = require("../services/analysis/warningService");
const { addAlert } = require("../services/infrastructure/alertService");
const { calculateDistanceMeters } = require("../helper/distance");
const { calculateDirection } = require("../helper/direction");

router.post("/animals/detect", (req, res) => {
  const io = req.app.get("io");
  const { type, latitude, longitude } = req.body;

  const animal = addAnimalDetection(type, latitude, longitude, req.body);
  io.emit("animal_detected", animal);

  const proximity = checkAnimalProximity(animal);
  const proximityAlert = buildAnimalProximityAlert(proximity);

  let savedAlert = null;
  let humanWarning = null;

  if (proximityAlert) {
    savedAlert = addAlert(proximityAlert);
    humanWarning = generateHumanWarning(proximity);
    io.emit("alert_created", savedAlert);
  }

  res.json({
    message: "Animal detected",
    animal,
    proximityWarning: proximity,
    alert: savedAlert,
    warningForHuman: humanWarning
  });
});

router.get("/animals/test-direction", (req, res) => {
  const direction = calculateDirection(
    45.5017,
    -73.5673,
    45.5020,
    -73.5670
  );

  res.json({ direction });
});

router.get("/animals/test-distance", (req, res) => {
  const d = calculateDistanceMeters(
    45.5017,
    -73.5673,
    45.5020,
    -73.5670
  );

  res.json({ distanceMeters: d });
});

router.get("/animals", (req, res) => {
  res.json(getAnimals());
});

module.exports = router;
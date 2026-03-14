const express = require("express");
const router = express.Router();

const { calculateDistanceMeters } = require("../helper/distance");
const { calculateDirection } = require("../helper/direction");
const { checkAnimalProximity } = require("../services/proximityService");
const { addAnimalDetection, getAnimals } = require("../services/animalService");
const { buildAnimalProximityAlert } = require("../services/threatAlertService");
const { addAlert } = require("../services/alertService");
const { generateHumanWarning } = require("../services/warningService");

// detect animal
router.post("/animals/detect", (req, res) => {

  const { type, latitude, longitude } = req.body;

  const animal = addAnimalDetection(type, latitude, longitude);
  const proximity = checkAnimalProximity(animal);
  const proximityAlert = buildAnimalProximityAlert(proximity);

  let savedAlert = null;
  let humanWarning = null;

  if (proximityAlert) {
    savedAlert = addAlert(proximityAlert);
    humanWarning = generateHumanWarning(proximity);
  }

  res.json({
    message: "Animal detected",
    animal,
    proximityWarning: proximity,
    alert: savedAlert,
    warningForHuman: humanWarning
  });
});

// test for direction
router.get("/animals/test-direction", (req, res) => {
  const direction = calculateDirection(
    45.5017,
    -73.5673,
    45.5020,
    -73.5670
  );

  res.json({ direction });
});

// test for distance
router.get("/animals/test-distance", (req, res) => {
  const d = calculateDistanceMeters(
    45.5017,
    -73.5673,
    45.5020,
    -73.5670
  );

  res.json({ distanceMeters: d });
});

// get all animals
router.get("/animals", (req, res) => {
  res.json(getAnimals());
});

module.exports = router;
const express = require("express");
const router = express.Router();

const { addAnimalDetection, getAnimals } = require("../services/animalService");

// detect animal
router.post("/animals/detect", (req, res) => {

  const { type, latitude, longitude } = req.body;

  const animal = addAnimalDetection(type, latitude, longitude);

  res.json({
    message: "Animal detected",
    animal
  });
});

// get all animals
router.get("/animals", (req, res) => {
  res.json(getAnimals());
});

module.exports = router;
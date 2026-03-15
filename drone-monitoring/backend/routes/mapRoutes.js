const express = require("express");
const router = express.Router();

const { getHumans } = require("../services/detection/humanService");
const { getAnimals } = require("../services/detection/animalService");
const { getAlerts } = require("../services/infrastructure/alertService");

router.get("/map/events", (req, res) => {

    const humans = getHumans();
    const animals = getAnimals();
    const alerts = getAlerts();

    res.json({
        timestamp: new Date(),
        humans,
        animals,
        alerts
    });

});

module.exports = router;
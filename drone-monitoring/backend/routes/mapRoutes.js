const express = require("express");
const router = express.Router();

const { getHumans } = require("../services/humanService");
const { getAnimals } = require("../services/animalService");
const { getAlerts } = require("../services/alertService");

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
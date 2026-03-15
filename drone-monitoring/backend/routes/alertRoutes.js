const express = require("express");
const router = express.Router();
const { getAlerts } = require("../services/alertService");

router.get("/alerts", (req, res) => {
    res.json(getAlerts());
});

router.get("/alerts/severity/:level", (req, res) => {

    const { level } = req.params;

    const filtered = getAlerts().filter(alert => alert.severity === level);

    res.json(filtered);

});

module.exports = router;
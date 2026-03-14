const express = require("express");
const router = express.Router();

const { postHumanDetection, getHumanIncidents } = require("../controllers/humanController");

router.post("/detections/human", postHumanDetection);
router.get("/incidents", getHumanIncidents);
const { addHuman, getHumans } = require("../services/humanService");

router.post("/humans/detect", (req, res) => {
    const io = req.app.get("io");
    const { latitude, longitude } = req.body;

    const human = addHuman(latitude, longitude);
    io.emit("human_detected", human);

    res.json({
        message: "Human detected",
        human
    });
});

router.get("/humans", (req, res) => {
    res.json(getHumans());
});

module.exports = router;
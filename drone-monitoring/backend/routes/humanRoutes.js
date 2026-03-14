const express = require("express");
const router = express.Router();

const { postHumanDetection, getHumanIncidents } = require("../controllers/humanController");

router.post("/detections/human", postHumanDetection);
router.get("/incidents", getHumanIncidents);

module.exports = router;
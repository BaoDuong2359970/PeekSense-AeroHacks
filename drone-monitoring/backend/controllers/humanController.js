const { detections, incidents, alerts } = require("../services/humanStore");
const { evaluateHumanDistress } = require("../services/distressRulesService");
const { get } = require("../routes/droneRoutes");

function generateId(prefix) {
  return `${prefix}_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
}

const getHumanIncidents = (req, res) => {
  try {
    return res.json({
      success: true,
      incidents,
    });
  } catch (error) {
    console.error("getHumanIncidents error:", error);
    return res.status(500).json({
      success: false,
      error: "Server error while fetching incidents",
    });
  }
};

const postHumanDetection = (req, res) => {
  try {
    if (!req.body) {
      return res.status(400).json({
        success: false,
        error: "Request body is missing",
      });
    }

    const {
      type,
      latitude,
      longitude,
      confidence,
      timestamp,
      droneId,
      immobile = false,
      audioLabel = null,
    } = req.body;

    if (
      type !== "human" ||
      latitude === undefined ||
      longitude === undefined ||
      confidence === undefined ||
      !timestamp ||
      !droneId
    ) {
      return res.status(400).json({
        success: false,
        error: "Missing or invalid required fields",
      });
    }

    const detection = {
      id: generateId("det"),
      type,
      latitude,
      longitude,
      confidence,
      timestamp,
      droneId,
      immobile,
      audioLabel,
    };

    detections.push(detection);

    const io = req.app.get("io");
    if (io) {
      io.emit("human_detected", detection);
    }

    const distressResult = evaluateHumanDistress(detection);

    let createdIncident = null;
    let createdAlert = null;

    if (distressResult.isDistress) {
      createdIncident = {
        id: generateId("inc"),
        type: "human",
        severity: distressResult.severity,
        status: "active",
        message: distressResult.message,
        timestamp: new Date().toISOString(),
        location: {
          latitude: detection.latitude,
          longitude: detection.longitude,
        },
        detectionId: detection.id,
        summary: null,
      };

      createdAlert = {
        id: generateId("alert"),
        category: "human_safety",
        type: "distress",
        severity: distressResult.severity,
        message: distressResult.message,
        timestamp: new Date().toISOString(),
        status: "active",
        location: {
          latitude: detection.latitude,
          longitude: detection.longitude,
        },
      };

      incidents.push(createdIncident);
      alerts.push(createdAlert);

      if (io) {
        io.emit("distress_incident_created", createdIncident);
        io.emit("alert_updated", createdAlert);
      }
    }

    return res.status(201).json({
      success: true,
      detection,
      incident: createdIncident,
      alert: createdAlert,
    });
  } catch (error) {
    console.error("postHumanDetection error:", error);
    return res.status(500).json({
      success: false,
      error: "Server error while processing human detection",
    });
  }
};

module.exports = {
  postHumanDetection,
  getHumanIncidents
};
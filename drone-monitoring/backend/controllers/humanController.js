const { detections, incidents, alerts } = require("../services/stores/humanStore");
const { assistanceChecks } = require("../services/stores/assistanceCheckStore");
const { startAssistanceCheck, handleTranscriptResponse } = require("../services/conversationService");
// const { get } = require("../routes/droneRoutes");

function generateId(prefix) {
  return `${prefix}_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
}

// -------------------------- INCIDENTS --------------------------
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

const postHumanDetection = async (req, res) => {
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

    let assistanceCheck = null;

    // Asks if human is okay
    if (immobile === true) {
      assistanceCheck = await startAssistanceCheck(detection, io);
    }

    return res.status(201).json({
      success: true,
      detection,
      assistanceCheck,
      incident: null,
      alert: null,
    });
  } catch (error) {
    console.error("postHumanDetection error:", error);
    return res.status(500).json({
      success: false,
      error: "Server error while processing human detection",
    });
  }
};

const postHumanResponse = async (req, res) => {
  try {
    const { id } = req.params;
    const { transcript } = req.body || {};

    const assistanceCheck = assistanceChecks.find((item) => item.id === id);

    if (!assistanceCheck) {
      return res.status(404).json({
        success: false,
        error: "Assistance check not found",
      });
    }

    const analysis = await handleTranscriptResponse(
        assistanceCheck,
        transcript || ""
    );

    return res.json({
      success: true,
      assistanceCheck,
      analysis,
    });
  } catch (error) {
    console.error("postHumanResponse error:", error);
    return res.status(500).json({
      success: false,
      error: "Server error while processing human response",
    });
  }
};

module.exports = {
    postHumanDetection,
    getHumanIncidents,
    postHumanResponse
};
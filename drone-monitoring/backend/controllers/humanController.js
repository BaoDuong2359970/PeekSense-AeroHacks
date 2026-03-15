const { createHumanDetection } = require("../services/detection/humanService");
const { evaluateDistress } = require("../services/distressRulesService");
const { addIncident } = require("../services/stores/humanStore");
const { addAlert } = require("../services/infrastructure/alertService");
const { addCheck, updateCheckResponse } = require("../services/stores/assistanceCheckStore");
const { buildAssistancePrompt, buildEmergencyPrompt } = require("../services/AI/conversationService");

function handleHumanDetection(req, res) {
  const io = req.app.get("io");
  const detection = createHumanDetection(req.body);

  io.emit("human_detected", detection);

  const distress = evaluateDistress(detection);
  let incident = null;
  let alert = null;
  let assistanceCheck = null;

  if (distress.isDistress) {
    incident = addIncident({
      id: "incident_" + Date.now(),
      type: "human_distress",
      severity: distress.severity,
      reason: distress.reason,
      timestamp: new Date(),
      humanId: detection.id,
      location: {
        latitude: detection.latitude,
        longitude: detection.longitude
      }
    });

    assistanceCheck = addCheck({
      id: "check_" + Date.now(),
      humanId: detection.id,
      incidentId: incident.id,
      prompt: buildAssistancePrompt(),
      status: "pending",
      createdAt: new Date()
    });

    alert = addAlert({
      category: "human_safety",
      type: "distress",
      severity: distress.severity,
      message: distress.reason,
      timestamp: new Date(),
      location: {
        latitude: detection.latitude,
        longitude: detection.longitude
      },
      details: {
        humanId: detection.id,
        incidentId: incident.id,
        assistanceCheckId: assistanceCheck.id
      }
    });

    io.emit("alert_created", alert);
  }

  res.json({
    detection,
    distress,
    incident,
    assistanceCheck,
    alert
  });
}

function respondToAssistanceCheck(req, res) {
  const { id } = req.params;
  const { response } = req.body;

  const updatedCheck = updateCheckResponse(id, response);
  if (!updatedCheck) {
    return res.status(404).json({ error: "Assistance check not found" });
  }

  const followUp = response === "no_response" ? buildEmergencyPrompt() : null;

  res.json({
    updatedCheck,
    followUp
  });
}

module.exports = {
  handleHumanDetection,
  respondToAssistanceCheck
};
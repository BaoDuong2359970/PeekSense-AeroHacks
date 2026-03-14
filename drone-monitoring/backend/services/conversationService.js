const { assistanceChecks } = require("./stores/assistanceCheckStore");
const { incidents, alerts } = require("./stores/humanStore");
const { generateHumanCheckPrompt, analyzeHumanResponse, generateIncidentSummary } = require("./geminiService");
const { synthesizeSpeech } = require("./elevenLabsService");

function generateId(prefix) {
  return `${prefix}_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
}

const startAssistanceCheck = async (detection, io) => {
    const promptText = await generateHumanCheckPrompt();
    const speechResult = await synthesizeSpeech(promptText);

    const assistanceCheck = {
        id: generateId("check"),
        detectionId: detection.id,
        status: "pending",
        startedAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 10000).toISOString(), // 10 seconds to respond
        promptText,
        audioUrl: speechResult.audioUrl,
        responseTranscript: null,
        responded: false,
    };

    assistanceChecks.push(assistanceCheck);

    if (io) {
        io.emit("human_assistance_check_started", assistanceCheck);
    }

    setTimeout(async () => {
        if (assistanceCheck.responded) return;

        const summary = await generateIncidentSummary({
            detection,
            transcript: assistanceCheck.responseTranscript
        });
        
        const incident = {
            id: generateId("inc"),
            type: "human",
            severity: "high",
            status: "active",
            message: "Unresponsive immobilized human detected after no response",
            timestamp: new Date().toISOString(),
            location: {
                latitude: detection.latitude,
                longitude: detection.longitude,
            },
            detectionId: detection.id,
            summary,
        };

        const alert = {
            id: generateId("alert"),
            category: "human_safety",
            type: "distress",
            severity: "high",
            message: "Human detected unresponsive after assistance check",
            timestamp: new Date().toISOString(),
            status: "active",
            location: {
                latitude: detection.latitude,
                longitude: detection.longitude,
            }
        };

        incidents.push(incident);
        alerts.push(alert);

        assistanceCheck.status = "expired_no_response";

        if (io) {
            io.emit("distress_incident_created", incident);
            io.emit("alert_updated", alert);
        }
    }, 10000);

    return assistanceCheck;
};

const handleTranscriptResponse = async (assistanceCheck, transcript) => {
    const analysis = await analyzeHumanResponse(transcript);

    if (analysis.responded) {
        assistanceCheck.responded = true;
        assistanceCheck.status = analysis.needsHelp ? "responded_needs_help" : "responded_no_help";
    }

    return analysis;
};

module.exports = {
    startAssistanceCheck,
    handleTranscriptResponse
};
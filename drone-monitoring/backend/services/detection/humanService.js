const { addDetection, getDetections } = require("../stores/humanStore");

function createHumanDetection(data) {
  const detection = {
    id: "human_" + Date.now(),
    type: "human",
    latitude: data.latitude,
    longitude: data.longitude,
    timestamp: data.timestamp ? new Date(data.timestamp) : new Date(),
    confidence: data.confidence ?? 1,
    status: data.status || "standing",
    movement: data.movement || null,
    source: data.source || "manual",
    detectedBy: data.detectedBy || "drone-01",
    noResponse: data.noResponse || false,
    soundLabel: data.soundLabel || null
  };

  return addDetection(detection);
}

function getHumans() {
  return getDetections();
}

module.exports = {
  createHumanDetection,
  getHumans
};
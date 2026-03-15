const detections = [];
const incidents = [];

function addDetection(detection) {
  detections.push(detection);
  return detection;
}

function getDetections() {
  return detections;
}

function addIncident(incident) {
  incidents.push(incident);
  return incident;
}

function getIncidents() {
  return incidents;
}

module.exports = {
  addDetection,
  getDetections,
  addIncident,
  getIncidents
};
let alerts = [];

function addAlert(alert) {
  const fullAlert = {
    id: "alert_" + Date.now(),
    status: "active",
    ...alert
  };

  alerts.push(fullAlert);
  return fullAlert;
}

function getAlerts() {
  return alerts;
}

function getAlertById(id) {
  return alerts.find((a) => a.id === id) || null;
}

function updateAlertStatus(id, status) {
  const alert = alerts.find((a) => a.id === id);
  if (!alert) return null;

  alert.status = status;
  return alert;
}

module.exports = {
  addAlert,
  getAlerts,
  getAlertById,
  updateAlertStatus
};
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

module.exports = {
  addAlert,
  getAlerts
};
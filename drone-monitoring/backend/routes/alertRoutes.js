const express = require("express");
const router = express.Router();
const { getAlerts, updateAlertStatus } = require("../services/infrastructure/alertService");

router.get("/alerts", (req, res) => {
  res.json(getAlerts());
});

router.get("/alerts/severity/:level", (req, res) => {
  const { level } = req.params;
  const filtered = getAlerts().filter((alert) => alert.severity === level);
  res.json(filtered);
});

router.post("/alerts/:id/acknowledge", (req, res) => {
  const alert = updateAlertStatus(req.params.id, "acknowledged");
  if (!alert) return res.status(404).json({ error: "Alert not found" });
  res.json(alert);
});

router.post("/alerts/:id/resolve", (req, res) => {
  const alert = updateAlertStatus(req.params.id, "resolved");
  if (!alert) return res.status(404).json({ error: "Alert not found" });
  res.json(alert);
});

module.exports = router;
const checks = [];

function addCheck(check) {
  checks.push(check);
  return check;
}

function getChecks() {
  return checks;
}

function getCheckById(id) {
  return checks.find((c) => c.id === id) || null;
}

function updateCheckResponse(id, response) {
  const check = checks.find((c) => c.id === id);
  if (!check) return null;

  check.response = response;
  check.respondedAt = new Date();
  return check;
}

module.exports = {
  addCheck,
  getChecks,
  getCheckById,
  updateCheckResponse
};
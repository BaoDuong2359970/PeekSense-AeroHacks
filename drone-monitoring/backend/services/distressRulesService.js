function evaluateDistress(humanDetection) {
  const status = humanDetection.status || "unknown";
  const speed = humanDetection.movement?.speed ?? null;
  const noResponse = humanDetection.noResponse === true;
  const soundLabel = (humanDetection.soundLabel || "").toLowerCase();

  if (
    status === "lying_on_ground" ||
    noResponse ||
    soundLabel.includes("scream") ||
    soundLabel.includes("help")
  ) {
    return {
      isDistress: true,
      severity: "critical",
      reason: "Possible human in distress detected"
    };
  }

  if (speed === 0 && status === "immobile") {
    return {
      isDistress: true,
      severity: "high",
      reason: "Human immobile for suspicious duration"
    };
  }

  return {
    isDistress: false,
    severity: "low",
    reason: "No strong distress indicators"
  };
}

module.exports = { evaluateDistress };
function evaluateHumanDistress(detection) {
  if (detection.immobile === true && detection.audioLabel === "scream") {
    return {
      isDistress: true,
      severity: "critical",
      message: "Possible unresponsive human with distress audio detected",
    };
  }

  if (detection.immobile === true) {
    return {
      isDistress: true,
      severity: "high",
      message: "Possible unresponsive human detected",
    };
  }

  return {
    isDistress: false,
    severity: null,
    message: null,
  };
}

module.exports = {
  evaluateHumanDistress,
};
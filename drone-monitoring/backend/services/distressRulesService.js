function evaluateHumanDistress(detection) {
  if (detection.immobile === true && detection.audioLabel === "scream") {
    return {
      isDistress: true,
      severity: "critical",
      message: "Unresponsive human with distress audio detected",
    };
  }

  // And is not responding to audio
  if (detection.immobile === true) {
    return {
      isDistress: true,
      severity: "critical",
      message: "Unresponsive human detected",
    };
  }

  if (detection.audioLabel === "scream") {
    return {
      isDistress: true,
      severity: "high",
      message: "Distress audio detected from human",
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
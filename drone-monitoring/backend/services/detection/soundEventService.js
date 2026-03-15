function classifySoundThreat(prediction) {
  const label = (prediction.label || "").toLowerCase();

  if (label.includes("scream") || label.includes("screaming")) {
    return {
      type: "human_distress",
      severity: "critical",
      message: "Possible human distress detected (screaming)."
    };
  }

  if (label.includes("gunshot")) {
    return {
      type: "weapon_detected",
      severity: "critical",
      message: "Gunshot detected in monitored area."
    };
  }

  if (label.includes("explosion")) {
    return {
      type: "explosion",
      severity: "critical",
      message: "Explosion sound detected."
    };
  }

  return null;
}

module.exports = {
  classifySoundThreat
};
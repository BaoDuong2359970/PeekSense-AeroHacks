function buildAnimalProximityAlert(proximityData) {
  if (!proximityData) return null;

  const severity = calculateSeverity(proximityData.distance);

  return {
    category: "environmental_threat",
    type: "proximity",
    severity,
    message: `${capitalize(proximityData.animalType)} detected ${proximityData.distance} meters ${proximityData.direction} of human`,
    timestamp: new Date(),
    details: {
      humanId: proximityData.humanId,
      animalId: proximityData.animalId,
      animalType: proximityData.animalType,
      distance: proximityData.distance,
      direction: proximityData.direction
    }
  };
}

function calculateSeverity(distance) {

  if (distance < 30) return "critical";
  if (distance < 80) return "high";
  if (distance < 150) return "medium";

  return "low";
}

function capitalize(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

module.exports = { buildAnimalProximityAlert };
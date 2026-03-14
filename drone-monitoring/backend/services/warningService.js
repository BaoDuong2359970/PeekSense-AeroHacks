function generateHumanWarning(proximity) {
  if (!proximity) return null;

  const animal = capitalize(proximity.animalType);

  let advice = "";

  if (proximity.distance < 30) {
    advice = "Remain calm and slowly move in the opposite direction.";
  } else if (proximity.distance < 80) {
    advice = "Stay alert and create distance from the animal.";
  } else {
    advice = "Be aware of wildlife in your surroundings.";
  }

  return {
    message: `${animal} detected ${proximity.distance} meters ${proximity.direction} of your position.`,
    advice
  };
}

function capitalize(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

module.exports = { generateHumanWarning };
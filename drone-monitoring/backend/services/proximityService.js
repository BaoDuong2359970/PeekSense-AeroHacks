const { calculateDistanceMeters } = require("../helper/distance");
const { calculateDirection } = require("../helper/direction");
const { getHumans } = require("./humanService");

function checkAnimalProximity(animal) {

  const humans = getHumans();

  if (humans.length === 0) {
    return null;
  }

  let closestHuman = null;
  let closestDistance = Infinity;

  humans.forEach(human => {

    const distance = calculateDistanceMeters(
      human.latitude,
      human.longitude,
      animal.latitude,
      animal.longitude
    );

    if (distance < closestDistance) {
      closestDistance = distance;
      closestHuman = human;
    }

  });

  if (!closestHuman) return null;

  const direction = calculateDirection(
    closestHuman.latitude,
    closestHuman.longitude,
    animal.latitude,
    animal.longitude
  );

  return {
    humanId: closestHuman.id,
    animalId: animal.id,
    distance: Math.round(closestDistance),
    direction,
    animalType: animal.type
  };

}

module.exports = { checkAnimalProximity };
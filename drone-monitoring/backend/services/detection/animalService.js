let animals = [];

function addAnimalDetection(type, latitude, longitude, extra = {}) {
  const animal = {
    id: "animal_" + Date.now(),
    type,
    latitude,
    longitude,
    timestamp: new Date(),
    ...extra
  };

  animals.push(animal);
  return animal;
}

function getAnimals() {
  return animals;
}

module.exports = {
  addAnimalDetection,
  getAnimals
};
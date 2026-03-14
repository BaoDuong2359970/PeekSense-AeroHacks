let animals = [];

function addAnimalDetection(type, latitude, longitude) {

  const animal = {
    id: "animal_" + Date.now(),
    type: type,
    latitude: latitude,
    longitude: longitude,
    timestamp: new Date()
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
let humans = [];

function addHuman(latitude, longitude) {
  const human = {
    id: "human_" + Date.now(),
    type: "human",
    latitude,
    longitude,
    timestamp: new Date()
  };

  humans.push(human);
  return human;
}

function getHumans() {
  return humans;
}

module.exports = {
  addHuman,
  getHumans
};
let droneState = {
  droneId: "drone-01",
  latitude: 45.5017,
  longitude: -73.5673,
  battery: 100,
  status: "patrolling",
  timestamp: new Date()
};

function startDroneSimulation(io) {
  setInterval(() => {
    droneState.latitude += (Math.random() - 0.5) * 0.0005;
    droneState.longitude += (Math.random() - 0.5) * 0.0005;
    droneState.battery = Math.max(0, droneState.battery - 0.01);
    droneState.timestamp = new Date();

    io.emit("drone_position_updated", droneState);
  }, 2000);
}

module.exports = {
  droneState,
  startDroneSimulation
};
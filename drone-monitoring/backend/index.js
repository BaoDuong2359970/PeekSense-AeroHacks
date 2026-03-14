const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const animalRoutes = require("./routes/animalRoutes");
const droneRoutes = require("./routes/droneRoutes");
const { startDroneSimulation } = require("./services/droneSimulator");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }
});

app.use(express.json());

app.use("/api", droneRoutes);
app.use("/api", animalRoutes);

app.get("/", (req, res) => {
  res.send("Backend is running");
});

io.on("connection", (socket) => {
  console.log("Client connected");
});

startDroneSimulation(io);

server.listen(3000, () => {
  console.log("Server running on port 3000");
});
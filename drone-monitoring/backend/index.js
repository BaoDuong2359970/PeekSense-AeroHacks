require('dotenv').config();

const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const humanRoutes = require("./routes/humanRoutes");
const animalRoutes = require("./routes/animalRoutes");
const droneRoutes = require("./routes/droneRoutes");
const alertRoutes = require("./routes/alertRoutes");
const soundRoutes = require("./routes/soundRoutes");
const mapRoutes = require("./routes/mapRoutes");

const { startDroneSimulation } = require("./services/infrastructure/droneSimulator");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }
});

app.set("io", io);

app.use(express.json());

app.use("/api", droneRoutes);
app.use("/api", humanRoutes);
app.use("/api", animalRoutes);
app.use("/api", alertRoutes);
app.use("/api", soundRoutes);
app.use("/api", mapRoutes);

app.get("/", (req, res) => {
  res.send("Backend is running");
});

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);
});

startDroneSimulation(io);

server.listen(4000, () => {
  console.log("Server running on port 4000");
});
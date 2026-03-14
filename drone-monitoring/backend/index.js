require("dotenv").config();

const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const { startDroneSimulation } = require("./services/droneSimulator");

const humanRoutes = require("./routes/humanRoutes");
const animalRoutes = require("./routes/animalRoutes");
const droneRoutes = require("./routes/droneRoutes");
const alertRoutes = require("./routes/alertRoutes");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }
});

app.set("io", io);

app.use(express.json());

app.use("/api", humanRoutes);

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);
});

app.use("/api", droneRoutes);
app.use("/api", animalRoutes);
app.use("/api", humanRoutes);
app.use("/api", alertRoutes);

app.use(
  "/generated-audio",
  express.static(path.join(__dirname, "..", "generated-audio"))
);

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
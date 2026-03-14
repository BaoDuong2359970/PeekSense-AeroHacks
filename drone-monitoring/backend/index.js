const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const humanRoutes = require("./routes/humanRoutes");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

app.set("io", io);

app.use(cors());
app.use(express.json());

app.use("/api", humanRoutes);

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);
});

const droneRoutes = require("./routes/droneRoutes");

app.use("/api", droneRoutes);

app.get("/", (req, res) => {
  res.send("Backend is running");
});

app.get("/api/health", (req, res) => {
  res.json({
    ok: true,
    message: "Backend is running",
  });
});

server.listen(3000, () => {
  console.log("Server running on port 3000");
});
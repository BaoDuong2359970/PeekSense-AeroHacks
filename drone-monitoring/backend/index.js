const express = require("express");
const app = express();

app.use(express.json());

const droneRoutes = require("./routes/droneRoutes");

app.use("/api", droneRoutes);

app.get("/", (req, res) => {
  res.send("Backend is running");
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
const express = require("express");
const cors = require("cors");
const canvasRoutes = require("./routes/canvas.routes");

const app = express();

const PORT = 5000;

app.use(cors());
app.use(express.json({ limit: "10mb" }));

app.use("/api/canvas", canvasRoutes);

app.get("/health", (req, res) => {
  res.send("Server is running");
});

app.listen(PORT, () => {
  console.log(`Server running at PORT : ${PORT}`);
});
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json({ limit: "10mb" }));

// Health Check
app.get("/", (req, res) => {
  res.json({
    status: "DashPad Engine Running 🚀",
  });
});

// Build API (Trial Simulation)
app.post("/build", async (req, res) => {
  const { code } = req.body;

  if (!code) {
    return res.status(400).json({
      status: "error",
      message: "No code provided",
    });
  }

  console.log("Received code length:", code.length);

  // Simulate build delay
  setTimeout(() => {
    res.json({
      status: "success",
      message: "Build completed successfully (Trial Mode)",
      downloadUrl: "https://example.com/fake-apk.apk",
    });
  }, 3000);
});

app.listen(PORT, () => {
  console.log(`DashPad Engine running on port ${PORT}`);
});

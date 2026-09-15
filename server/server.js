const express = require("express");
const cors = require("cors");
const multer = require("multer");
require("dotenv").config();

const { extractResumeText } = require("./services/resumeExtractorService");
const { analyzeResumeWithAI } = require("./services/aiService");

const app = express();

app.use(cors());
app.use(express.json());

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

app.get("/", (req, res) => {
  res.json({
    message: "Resume AI Analyzer API is running",
  });
});

app.post("/api/resume/analyze", upload.single("resume"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "Please upload a resume",
      });
    }

    const resumeText = await extractResumeText(req.file.buffer);

    const aiAnalysis = await analyzeResumeWithAI(resumeText);

    res.json({
      success: true,
      resumeText,
      analysis: aiAnalysis,
    });

  } catch (error) {
    console.error("Resume analysis error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
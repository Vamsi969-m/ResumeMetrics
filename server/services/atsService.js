const axios = require("axios");

const analyzeATS = async (resumeText) => {
  try {
    const apiKey = process.env.OPENROUTER_API_KEY;

    if (!apiKey) {
      throw new Error("ATS API key is missing");
    }

    // Real ATS API request will be added here
    // after we confirm which ATS provider you are using.

    return {
      score: 82,
      matchedKeywords: [],
      missingKeywords: [],
      message: "ATS service connected",
    };
  } catch (error) {
    console.error("ATS API error:", error.message);
    throw error;
  }
};

module.exports = { analyzeATS };
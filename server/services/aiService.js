const axios = require("axios");

const analyzeResumeWithAI = async (resumeText) => {
  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "openrouter/free",

        response_format: {
          type: "json_object",
        },

        messages: [
          {
            role: "system",
            content: `
You are an expert professional resume analyzer.

Analyze the resume and return ONLY valid JSON.

Do not return markdown.
Do not return code blocks.
Do not return explanations outside JSON.

Return exactly this structure:

{
  "overallScore": 0,
  "scores": {
    "ats": 0,
    "content": 0,
    "skills": 0,
    "projects": 0,
    "formatting": 0
  },
  "summary": "",
  "strengths": [],
  "weaknesses": [],
  "missingSkills": [],
  "jobRoles": [
    {
      "title": "",
      "match": 0,
      "reason": ""
    }
  ],
  "improvements": [],
  "learningRecommendations": [
    {
      "skill": "",
      "priority": "High",
      "reason": ""
    }
  ],
  "keywords": [],
  "careerRoadmap": [
    {
      "stage": "",
      "skills": [],
      "goal": ""
    }
  ],
  "mistakes": {
    "score": 0,
    "total": 0,
    "grammar": [],
    "spelling": [],
    "repeatedWords": [],
    "weakSentences": [],
    "formatting": [],
    "dateFormat": [],
    "longBulletPoints": [],
    "missingAchievements": []
  }
}

Rules:

- All scores must be between 0 and 100.
- overallScore must be a number.
- jobRoles.match must be between 0 and 100.
- priority must be High, Medium, or Low.
- Only use information found in the resume.
- Do not invent experience.
- Do not invent projects.
- Do not invent certifications.
- Do not invent education.
- Do not invent skills.
- Do not invent achievements.
- Do not invent numbers.
- Identify realistic strengths.
- Identify realistic weaknesses.
- Identify useful missing skills.
- Recommend suitable job roles.
- Give practical resume improvements.
- Give realistic learning recommendations.
- Create a simple career roadmap.
- Keep the analysis concise.

Analyze the resume for actual mistakes.

Check for:

- Grammar mistakes.
- Spelling mistakes.
- Excessive repeated words.
- Weak or vague sentences.
- Formatting inconsistencies.
- Inconsistent date formats.
- Overly long bullet points.
- Missing measurable achievements.

For each mistake, provide a clear explanation and practical suggestion.

Do not invent mistakes.

Do not flag normal repetition of technical skills such as Java, React, SQL, Node.js, etc.

If a category has no mistakes, return an empty array.

mistakes.score must be between 0 and 100.

mistakes.total must represent the total number of identified mistakes.
`,
          },
          {
            role: "user",
            content: `
Analyze this resume:

${resumeText}
`,
          },
        ],

        temperature: 0.2,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const aiResponse =
      response.data?.choices?.[0]?.message?.content;

    console.log("AI Response:", aiResponse);

    if (!aiResponse) {
      throw new Error("AI returned an empty response");
    }

    let cleanedResponse = aiResponse
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    const jsonStart = cleanedResponse.indexOf("{");
    const jsonEnd = cleanedResponse.lastIndexOf("}");

    if (jsonStart === -1 || jsonEnd === -1) {
      console.error("Invalid AI response:");
      console.error(cleanedResponse);

      throw new Error("AI did not return valid JSON");
    }

    cleanedResponse = cleanedResponse.slice(
      jsonStart,
      jsonEnd + 1
    );

    let analysis;

    try {
      analysis = JSON.parse(cleanedResponse);
    } catch (parseError) {
      console.error("JSON Parse Error:", parseError.message);
      console.error("AI Response:", cleanedResponse);

      throw new Error("AI returned malformed JSON");
    }

    return analysis;

  } catch (error) {
    console.error(
      "OpenRouter Error:",
      error.response?.data || error.message
    );

    if (
      error.message === "AI did not return valid JSON" ||
      error.message === "AI returned malformed JSON"
    ) {
      throw new Error(
        "AI returned an invalid analysis format. Please try again."
      );
    }

    if (error.message === "AI returned an empty response") {
      throw new Error(
        "AI returned an empty response. Please try again."
      );
    }

    throw new Error("AI resume analysis failed");
  }
};

module.exports = {
  analyzeResumeWithAI,
};

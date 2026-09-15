const { PDFParse } = require("pdf-parse");

const extractResumeText = async (buffer) => {
  try {
    const parser = new PDFParse({
      data: buffer,
    });

    const result = await parser.getText();

    await parser.destroy();

    return result.text.trim();
  } catch (error) {
    console.error("PDF extraction error:", error);
    throw new Error("Failed to extract resume text");
  }
};

module.exports = {
  extractResumeText,
};
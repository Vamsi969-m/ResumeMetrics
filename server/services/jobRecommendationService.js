const getJobRecommendations = (analysis) => {
  const recommendations = [];

  if (!analysis) {
    return recommendations;
  }

  const skills = analysis.skills || [];
  const missingSkills = analysis.missingSkills || [];

  const skillText = skills
    .join(" ")
    .toLowerCase();

  const missingSkillText = missingSkills
    .join(" ")
    .toLowerCase();

  // Java Full Stack Developer
  if (
    skillText.includes("java") ||
    skillText.includes("spring") ||
    skillText.includes("react")
  ) {
    recommendations.push({
      title: "Java Full Stack Developer",
      match: 90,
      reason:
        "Your profile contains Java and frontend/backend technologies that are relevant to Java full-stack development.",
      requiredSkills: [
        "Java",
        "Spring Boot",
        "REST APIs",
        "React.js",
        "SQL",
        "Git",
      ],
      nextSkills: [
        "Spring Boot",
        "Microservices",
        "Spring Security",
      ],
    });
  }

  // Frontend Developer
  if (
    skillText.includes("react") ||
    skillText.includes("javascript") ||
    skillText.includes("html")
  ) {
    recommendations.push({
      title: "Frontend Developer",
      match: 85,
      reason:
        "Your frontend skills are suitable for building modern responsive web applications.",
      requiredSkills: [
        "HTML",
        "CSS",
        "JavaScript",
        "React.js",
        "Git",
      ],
      nextSkills: [
        "TypeScript",
        "Testing",
        "Next.js",
      ],
    });
  }

  // Node.js Developer
  if (
    skillText.includes("node") ||
    skillText.includes("express") ||
    skillText.includes("javascript")
  ) {
    recommendations.push({
      title: "Node.js Developer",
      match: 82,
      reason:
        "Your JavaScript, Node.js, and Express.js knowledge matches backend development requirements.",
      requiredSkills: [
        "JavaScript",
        "Node.js",
        "Express.js",
        "REST APIs",
        "MongoDB",
      ],
      nextSkills: [
        "Authentication",
        "Redis",
        "Docker",
      ],
    });
  }

  // Software Developer
  if (
    skillText.includes("java") ||
    skillText.includes("javascript") ||
    skillText.includes("python")
  ) {
    recommendations.push({
      title: "Software Developer",
      match: 80,
      reason:
        "Your programming fundamentals and development technologies provide a good foundation for software development roles.",
      requiredSkills: [
        "Programming",
        "OOP",
        "Data Structures",
        "Algorithms",
        "Git",
      ],
      nextSkills: [
        "System Design",
        "DSA",
        "Testing",
      ],
    });
  }

  // Sort by highest match
  recommendations.sort(
    (a, b) => b.match - a.match
  );

  return recommendations.slice(0, 5);
};

module.exports = {
  getJobRecommendations,
};
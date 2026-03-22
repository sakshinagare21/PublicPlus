export const calculatePriority = ({
  category,
  description,
  traffic,
  upvotes = 0,
}) => {
  let score = 0;

  const desc = description.toLowerCase();

  /* ================= CATEGORY WEIGHT ================= */

  switch (category) {
    case "fire":
      score += 80; // emergency
      break;

    case "pothole":
      score += 40;
      break;

    case "garbage":
      score += 25;
      break;

    case "water":
      score += 45; // water leakage / supply issue
      break;

    case "streetlight":
      score += 30;
      break;

    case "drain":
      score += 35;
      break;

    case "road_damage":
      score += 45;
      break;

    default:
      score += 20;
  }

  /* ================= DESCRIPTION KEYWORDS ================= */

  if (desc.includes("fire") || desc.includes("smoke")) {
    score += 60;
  }

  if (desc.includes("accident") || desc.includes("injury")) {
    score += 50;
  }

  if (desc.includes("danger") || desc.includes("urgent")) {
    score += 40;
  }

  if (desc.includes("leak") || desc.includes("overflow")) {
    score += 25;
  }

  if (desc.includes("blocked") || desc.includes("not working")) {
    score += 20;
  }

  /* ================= TRAFFIC IMPACT ================= */

  if (traffic?.level === "high") {
    score += 30;
  } else if (traffic?.level === "medium") {
    score += 15;
  }

  /* ================= USER ENGAGEMENT ================= */

  score += upvotes * 2;

  /* ================= NORMALIZATION (OPTIONAL) ================= */

  if (score > 100) score = 100;

  /* ================= PRIORITY LEVEL ================= */

  let level = "low";

  if (score >= 80) level = "critical";
  else if (score >= 60) level = "high";
  else if (score >= 40) level = "medium";

  return {
    score,
    level,
    calculatedAt: new Date(),
  };
};
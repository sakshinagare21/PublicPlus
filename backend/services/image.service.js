import crypto from "crypto";
import Issue from "../models/issue.model.js";

export const validateImage = async (file) => {
  if (!file) return {};

  try {
    /* ================= HASH ================= */
    const hash = crypto
      .createHash("md5")
      .update(file.filename) // use filename (not buffer now)
      .digest("hex");

    /* ================= DUPLICATE CHECK ================= */
    const existing = await Issue.findOne({ "images.hash": hash });

    let fraudScore = 0;
    let isDuplicate = false;

    if (existing) {
      isDuplicate = true;
      fraudScore += 40;
    }

    /* ================= FINAL ================= */
    return {
      url: `/uploads/issues/${file.filename}`, // ✅ REAL URL
      hash,

      flags: {
        isDuplicate,
        isSpam: fraudScore > 50,
        fraudScore,
      },
    };

  } catch (error) {
    console.log("Image error:", error.message);

    return {
      url: null,
      hash: null,
      flags: {
        isSpam: true,
        fraudScore: 90,
      },
    };
  }
};
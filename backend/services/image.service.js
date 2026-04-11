import crypto from "crypto";
import fs from "fs";
import path from "path";
import Issue from "../models/issue.model.js";
import { uploadToCloudinary } from "../utils/cloudinaryStorage.js";

export const validateImage = async (file) => {
  if (!file) return {};

  try {
    const filePath = path.resolve(file.path);
    
    /* ================= HASH ================= */
    const fileBuffer = fs.readFileSync(filePath);
    const hash = crypto
      .createHash("md5")
      .update(fileBuffer)
      .digest("hex");

    /* ================= DUPLICATE CHECK ================= */
    const existing = await Issue.findOne({ "images.hash": hash });

    let fraudScore = 0;
    let isDuplicate = false;

    if (existing) {
      isDuplicate = true;
      fraudScore += 40;
    }

    /* ================= CLOUDINARY UPLOAD ================= */
    // Note: uploadToCloudinary will automatically delete the local file after success.
    const publicUrl = await uploadToCloudinary(file, "issues");

    return {
      url: publicUrl, // ✅ CLOUDINARY URL
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
import admin from "../config/firebase.js";
import path from "path";
import fs from "fs";

const bucket = admin.storage().bucket();

export const uploadToFirebase = async (file, folder = "uploads") => {
  if (!file) return null;

  try {
    const filePath = path.resolve(file.path);
    const fileBuffer = fs.readFileSync(filePath);
    
    const fileName = `${folder}/${Date.now()}-${file.filename || file.originalname}`;
    const fileUpload = bucket.file(fileName);

    await fileUpload.save(fileBuffer, {
      metadata: {
        contentType: file.mimetype,
      },
    });

    // Make file public to get a direct URL
    await fileUpload.makePublic();
    
    // Cleanup local file after successful upload
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    return `https://storage.googleapis.com/${bucket.name}/${fileName}`;

  } catch (error) {
    console.error("Firebase Upload Error:", error.message);
    throw error;
  }
};

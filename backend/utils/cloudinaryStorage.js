import cloudinary from "../config/cloudinary.js";
import path from "path";
import fs from "fs";

/**
 * Uploads a local file to Cloudinary and deletes the local copy.
 * @param {Object} file - The file object from multer
 * @param {String} folder - The Cloudinary folder to store the image in
 */
export const uploadToCloudinary = async (file, folder = "public_plus") => {
  if (!file) return null;

  try {
    const filePath = path.resolve(file.path);

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(filePath, {
      folder: folder,
      resource_type: "image",
    });

    // Cleanup local file
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    return result.secure_url;

  } catch (error) {
    console.error("Cloudinary Upload Error:", error.message);
    throw error;
  }
};

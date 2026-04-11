import axios from "axios";
import fs from "fs";
import FormData from "form-data";
import path from "path";

/**
 * 🚀 PRODUCTION READY AI CHECK MIDDLEWARE
 * Connects to the Flask AI service via HTTP instead of local CLI.
 */

// Configuration - Use Environment Variables for Render
const AI_SERVICE_URL = (process.env.AI_SERVICE_URL || "http://localhost:5001/detect").trim();

export const aiImageCheck = async (req, res, next) => {
    // 🛡️ PASS-THROUGH (REMOVED: Now AI check is active)
    // return next();

    try {
        const files = req.files || (req.file ? [req.file] : []);

        if (files.length === 0) {
            return next();
        }

        console.log(`[AI-Detector] Routing ${files.length} assets to AI microservice: ${AI_SERVICE_URL}`);

        // Check each file against the AI service
        for (const file of files) {
            const filePath = path.resolve(file.path);

            // Prepare multipart form data
            const form = new FormData();
            form.append('file', fs.createReadStream(filePath));

            try {
                const response = await axios.post(AI_SERVICE_URL, form, {
                    headers: {
                        ...form.getHeaders(),
                    },
                    timeout: 30000, // 30s timeout for ML inference
                });

                console.log(`[AI-Detector] Response for ${file.filename}:`, response.data);

                const { is_ai, confidence, detected_as } = response.data;

                if (is_ai) {
                    console.warn(`[AI-Detector] THREAT DETECTED: ${file.filename} (${(confidence * 100).toFixed(1)}%)`);

                    // Cleanup locally saved file before rejecting
                    if (fs.existsSync(filePath)) {
                        fs.unlinkSync(filePath);
                    }

                    return res.status(400).json({
                        success: false,
                        message: "AI generated images are not allowed. Evidence must be authentic from the tactical field.",
                        code: "AI_GENERATED_CONTENT"
                    });
                }

                console.log(`[AI-Detector] Asset verified: ${file.filename} (REAL: ${((1 - confidence) * 100).toFixed(1)}%)`);

            } catch (apiError) {
                console.error(`[AI-Detector] Service Communication Failure for ${file.filename}:`, apiError.message);
                
                // High-Security: If AI link is down, we must deny authorization.
                return res.status(503).json({
                    success: false,
                    message: "Identity verification link dropped. Please ensure tactical AI services are operational.",
                    code: "AI_SERVICE_OFFLINE"
                });
            }
        }

        next();

    } catch (error) {
        console.error("[AI-Detector] Execution Failure:", error);
        next();
    }
};

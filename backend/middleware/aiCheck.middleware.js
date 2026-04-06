import { exec } from "child_process";
import path from "path";
import fs from "fs";
import { promisify } from "util";

const execPromise = promisify(exec);

// 🔥 CONFIGURATION
const PYTHON_PATH = "python"; // or "python3" depending on system
const DETECTOR_SCRIPT = "c:\\Users\\Admin\\Desktop\\AI Image Detection\\detect.py";
const MODEL_DIR = "c:\\Users\\Admin\\Desktop\\AI Image Detection";

/**
 * Middleware to check uploaded images for AI generation
 */
export const aiImageCheck = async (req, res, next) => {
    try {
        const files = req.files || (req.file ? [req.file] : []);

        if (files.length === 0) {
            return next();
        }

        const filePaths = files.map(file => path.resolve(file.path));
        const quotedPaths = filePaths.map(p => `"${p}"`).join(" ");

        console.log(`[AI-Detector] Executing batch verification on ${files.length} assets...`);

        // Run the Python script ONCE for all images
        const command = `cd /d "${MODEL_DIR}" && ${PYTHON_PATH} detect.py ${quotedPaths}`;
        const { stdout, stderr } = await execPromise(command);

        if (stderr && !stdout) {
            console.error("[AI-Detector] Batch Error:", stderr);
        }

        const lines = stdout?.split("\n") || [];
        let aiDetected = false;

        for (const line of lines) {
            if (line.includes("|AI|")) {
                aiDetected = true;
                const parts = line.split("|");
                const filePath = parts[1];
                
                console.warn(`[AI-Detector] THREAT DETECTED: ${filePath}`);
                
                // Delete offending file
                if (filePath && fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                }
            }
        }

        if (aiDetected) {
            return res.status(400).json({
                success: false,
                message: "AI generated images are not allowed. Evidence must be authentic from the tactical field.",
                code: "AI_GENERATED_CONTENT"
            });
        }

        console.log("[AI-Detector] Batch verified as REAL.");
        next();

    } catch (error) {
        console.error("[AI-Detector] Execution Failure:", error);
        // Fallback: Proceed if AI service fails (to avoid blocking legitimate workflows)
        next(); 
    }
};

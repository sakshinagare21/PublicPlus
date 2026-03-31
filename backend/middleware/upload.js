import multer from "multer";
import path from "path";
import fs from "fs";

/* ================= HELPER FUNCTION ================= */

const ensureDirectory = (dir) => {
 if (!fs.existsSync(dir)) {
 fs.mkdirSync(dir, { recursive: true });
 }
};

/* ================= FILE FILTER ================= */

const fileFilter = (req, file, cb) => {

 const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];

 if (allowedTypes.includes(file.mimetype)) {
 cb(null, true);
 } else {
 cb(new Error("Only image files are allowed"), false);
 }
};

/* ================= ISSUE IMAGE STORAGE ================= */

const issueUploadPath = "uploads/issues";
ensureDirectory(issueUploadPath);

const issueStorage = multer.diskStorage({

 destination: (req, file, cb) => {
 cb(null, issueUploadPath);
 },

 filename: (req, file, cb) => {
 const uniqueName =
 Date.now() + "-" + Math.round(Math.random() * 1e9);

 cb(null, uniqueName + path.extname(file.originalname));
 }

});

export const uploadIssueImages = multer({
 storage: issueStorage,
 limits: { fileSize: 5 * 1024 * 1024 },
 fileFilter
});


/* ================= OPERATOR PROOF STORAGE ================= */

const proofUploadPath = "uploads/proofs";
ensureDirectory(proofUploadPath);

const proofStorage = multer.diskStorage({

 destination: (req, file, cb) => {
 cb(null, proofUploadPath);
 },

 filename: (req, file, cb) => {
 const uniqueName =
 Date.now() + "-" + Math.round(Math.random() * 1e9);

 cb(null, uniqueName + path.extname(file.originalname));
 }

});

export const uploadProofImage = multer({
 storage: proofStorage,
 limits: { fileSize: 5 * 1024 * 1024 },
 fileFilter
});

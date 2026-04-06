import express from "express";
import { firebaseAuth, verifyOperator, verifyAdmin } from "../middleware/firebase.middleware.js";
import { attachUser } from "../middleware/firebase.middleware.js";
import { verifyDepartment } from "../middleware/firebase.middleware.js";
import { uploadIssueImages, uploadProofImage } from "../middleware/upload.js";
import { aiImageCheck } from "../middleware/aiCheck.middleware.js";
import {
  createIssue,
  getMyIssues,
  getIssueById,
  getDepartmentIssues,
  getDepartmentStats,
  deleteIssue,
  getOperatorIssues,
  getOperatorStats,
  getAllIssuesAdmin,
  getAdminStats,
  uploadProof,
  getTimer,
  verifyIssue,
  reopenIssue,
  getCitizenStats,
  getAllPublicIssues,
  upvoteIssue,
  downvoteIssue,
  escalateIssue,
  getNearbyIssues,
  updateIssueStatus
} from "../controller/issue.controller.js";

const router = express.Router();

/* ================= CITIZEN ================= */
router.post(
  "/",
  firebaseAuth,
  attachUser,
  uploadIssueImages.array("images", 5),
  aiImageCheck,
  createIssue
);

router.get("/my", firebaseAuth, attachUser, getMyIssues);
router.get("/stats", firebaseAuth, attachUser, getCitizenStats);
router.get("/all", firebaseAuth, attachUser, getAllPublicIssues);
router.get("/nearby", firebaseAuth, attachUser, getNearbyIssues);
router.post("/:id/upvote", firebaseAuth, attachUser, upvoteIssue);
router.post("/:id/downvote", firebaseAuth, attachUser, downvoteIssue);

router.delete("/:issueId", firebaseAuth, attachUser, deleteIssue);

/* ================= DEPARTMENT ================= */
// routes/issue.routes.js

router.get(
  "/department/issue",
  firebaseAuth,
  verifyDepartment,
  getDepartmentIssues
);

router.get(
  "/department/stats",
  firebaseAuth,
  verifyDepartment,
  getDepartmentStats
);

router.put(
  "/:issueId/status",
  firebaseAuth, // Changed from departmentAuth if you use unified firebaseAuth
  verifyDepartment,
  updateIssueStatus
);


/*================Operator================*/
router.get("/operator/issue", firebaseAuth, verifyOperator, getOperatorIssues); // Operators can view department issues too
router.get("/operator/stats", firebaseAuth, verifyOperator, getOperatorStats); // Get department statistics for operators

/*===========admin===========*/
router.get("/admin/all", firebaseAuth, verifyAdmin, getAllIssuesAdmin);
router.get("/admin/stats", firebaseAuth, verifyAdmin, getAdminStats);
/* ================= COMMON ================= */
/* KEEP THIS ALWAYS LAST */
router.get("/:issueId", firebaseAuth, getIssueById);

/* ================= ADVANCED WORKFLOW ================= */
router.post("/:id/upload-proof", firebaseAuth, verifyOperator, uploadProofImage.single("proof"), aiImageCheck, uploadProof);
router.get("/:id/timer", firebaseAuth, getTimer);
router.post("/:id/verify", firebaseAuth, attachUser, uploadProofImage.single("verificationImage"), aiImageCheck, verifyIssue);
router.post("/:id/reopen", firebaseAuth, attachUser, uploadProofImage.single("proof"), reopenIssue);
router.post("/:id/escalate", firebaseAuth, verifyOperator, uploadProofImage.single("proof"), aiImageCheck, escalateIssue);

export default router;
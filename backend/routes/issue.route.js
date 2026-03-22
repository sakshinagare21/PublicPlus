import express from "express";
import { firebaseAuth, verifyOperator } from "../middleware/firebase.middleware.js";
import { attachUser } from "../middleware/firebase.middleware.js";
import { verifyDepartment } from "../middleware/firebase.middleware.js";
import { uploadIssueImages } from "../middleware/upload.js";
import {
  createIssue,
  getMyIssues,
  getIssueById,
  getDepartmentIssues,
  getDepartmentStats,
  deleteIssue,
  getOperatorIssues,
  getOperatorStats
} from "../controller/issue.controller.js";

const router = express.Router();

/* ================= CITIZEN ================= */
router.post(
  "/",
  firebaseAuth,
  attachUser,
  uploadIssueImages.array("images", 5),
  createIssue
);

router.get("/my", firebaseAuth, attachUser, getMyIssues);

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


/*================Operator================*/
router.get("/operator/issue", firebaseAuth,verifyOperator, getOperatorIssues); // Operators can view department issues too
router.get("/operator/stats", firebaseAuth,verifyOperator, getOperatorStats); // Get department statistics for operators
/* ================= COMMON ================= */
/* KEEP THIS ALWAYS LAST */
router.get("/:issueId", firebaseAuth, getIssueById);
export default router;
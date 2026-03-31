import express from "express";
import { firebaseAuth } from "../middleware/firebase.middleware.js";
import { verifyDepartment } from "../middleware/firebase.middleware.js";

import {
  getDepartmentDashboard,
  getDepartmentIssues,
  addZone,
  removeZone,
  updateSLASettings,
  updateNotificationSettings,
  getDepartmentOperators,
  getPerformanceMetrics,
  addActivityLog,
  getDetailedReports,
  logReport,
} from "../controller/department.controller.js";

import {
  createZone,
  getAllZones,
  updateZone,
  deleteZone,
} from "../controller/zone.controller.js";
//working
import { registerDepartment, departmentLogin } from "../controller/department.controller.js";
//working
import {
getDepartments,
getMyZones,
approveOperator,
rejectOperator,
getPendingOperators,
getTakenIssueTypes,
updateIssueTypes,getMyDepartment,getOperatorDetails,getAllAvailableZones
} from "../controller/department.controller.js";
const router = express.Router();
router.post("/register", firebaseAuth, registerDepartment);

router.post("/login", firebaseAuth, verifyDepartment, departmentLogin);

//working 2 
//* PUBLIC ROUTES (NO AUTH REQUIRED) */

router.get("/list", getDepartments);

router.get(
"/my-zones",
firebaseAuth,
verifyDepartment,
getMyZones
);

router.get(
  "/available-zones",
  firebaseAuth,
  verifyDepartment,
  getAllAvailableZones
);

/* ================= GET MY DEPARTMENT ================= */
router.get("/me", firebaseAuth, verifyDepartment, getMyDepartment);

router.put("/approve-operator/:operatorId",firebaseAuth,verifyDepartment,approveOperator);
router.put("/reject-operator/:operatorId",firebaseAuth,verifyDepartment,rejectOperator);
router.get("/pending-operators",firebaseAuth,verifyDepartment,getPendingOperators);

router.get("/taken-types",firebaseAuth, verifyDepartment,getTakenIssueTypes);
router.put("/issue-types", firebaseAuth, verifyDepartment,updateIssueTypes);
router.get("/operators", firebaseAuth, verifyDepartment, getDepartmentOperators);
router.get(
  "/operator/:operatorId",
  firebaseAuth,
  verifyDepartment, // department can view operator
  getOperatorDetails
);
//not
router.get("/dashboard", firebaseAuth, verifyDepartment, getDepartmentDashboard);

router.get("/issues", firebaseAuth, verifyDepartment, getDepartmentIssues);

router.post("/zones", firebaseAuth, verifyDepartment, addZone);
router.delete("/zones/:zoneCode", firebaseAuth, verifyDepartment, removeZone);

router.put("/sla", firebaseAuth, verifyDepartment, updateSLASettings);

router.put("/notifications", firebaseAuth, verifyDepartment, updateNotificationSettings);

router.get("/performance", firebaseAuth, verifyDepartment, getPerformanceMetrics);

router.post("/activity", firebaseAuth, verifyDepartment, addActivityLog);

router.get("/detailed-reports", firebaseAuth, verifyDepartment, getDetailedReports);
router.post("/log-report", firebaseAuth, verifyDepartment, logReport);

/* ================= ZONE CONFIGURATION (FOR DEPT) ================= */
router.get("/all-zones", firebaseAuth, verifyDepartment, getAllZones);
router.post("/config-zones", firebaseAuth, verifyDepartment, createZone);
router.put("/config-zones/:id", firebaseAuth, verifyDepartment, updateZone);
router.delete("/config-zones/:id", firebaseAuth, verifyDepartment, deleteZone);

export default router;
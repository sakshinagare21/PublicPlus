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
  addActivityLog
} from "../controller/department.controller.js";
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
updateIssueTypes,getMyDepartment,getOperatorDetails
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

export default router;
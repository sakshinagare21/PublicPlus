import express from "express";
import { firebaseAuth } from "../middleware/firebase.middleware.js";
import { verifyAdmin } from "../middleware/firebase.middleware.js";

import {
  getAdminDashboard,
  createAdmin,
  getAllAdmins,
  updateAdmin,
  updateAdminStatus,
  updateSLASettings,
  updateAIConfiguration,
  addAdminActivityLog,
  updateDashboardPreferences
} from "../controller/admin.controller.js";
import {
  getPendingDepartments,
  approveDepartment,
  rejectDepartment
} from "../controller/admin.controller.js";
const router = express.Router();


/*department approval routes */
router.get(
  "/department-requests",
  firebaseAuth,
  verifyAdmin,
  getPendingDepartments
);

router.put(
  "/approve-department/:id",
  firebaseAuth,
  verifyAdmin,
  approveDepartment
);

router.put(
  "/reject-department/:id",
  firebaseAuth,
  verifyAdmin,
  rejectDepartment
);


router.get("/dashboard", firebaseAuth, verifyAdmin, getAdminDashboard);

router.post("/", firebaseAuth, verifyAdmin, createAdmin);

router.get("/", firebaseAuth, verifyAdmin, getAllAdmins);

router.put("/:adminId", firebaseAuth, verifyAdmin, updateAdmin);

router.put("/:adminId/status", firebaseAuth, verifyAdmin, updateAdminStatus);

router.put("/sla", firebaseAuth, verifyAdmin, updateSLASettings);

router.put("/ai", firebaseAuth, verifyAdmin, updateAIConfiguration);

router.post("/activity", firebaseAuth, verifyAdmin, addAdminActivityLog);

router.put("/preferences", firebaseAuth, verifyAdmin, updateDashboardPreferences);

export default router;
import express from "express";
import { firebaseAuth } from "../middleware/firebase.middleware.js";
import { verifyAdmin } from "../middleware/firebase.middleware.js";
import {
  getPendingDepartments,
  approveDepartment,
  rejectDepartment,
  getAllZones,getAllOperators,
  getAllUsers,
  getAllAccounts,
  getAdminDashboard,
} from "../controller/admin.controller.js";
import { getAllDepartments } from "../controller/admin.controller.js";
const router = express.Router();

router.get(
  "/dashboard",
  firebaseAuth, // optional but good
  getAdminDashboard
);
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

/*admin*/
router.get("/departments", firebaseAuth, verifyAdmin, getAllDepartments);
router.get("/operators", firebaseAuth, verifyAdmin, getAllOperators);
router.get("/zones", firebaseAuth, verifyAdmin, getAllZones);
router.get("/users",firebaseAuth, verifyAdmin, getAllUsers);
router.get("/accounts", firebaseAuth, verifyAdmin, getAllAccounts);
export default router;
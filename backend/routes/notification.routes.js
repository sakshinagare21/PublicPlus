import express from "express";
import { firebaseAuth, verifyAdmin ,verifyDepartment} from "../middleware/firebase.middleware.js";

import {
  getAdminNotifications,
  markNotificationRead,
  getUnreadNotifications,
  deleteNotification,
  markAllAsRead,
  getDepartmentNotifications
} from "../controller/notification.controller.js";

const router = express.Router();

/* ================= GET ALL ADMIN NOTIFICATIONS ================= */
router.get(
  "/admin",
  firebaseAuth,
  verifyAdmin,
  getAdminNotifications
);

/* ================= GET UNREAD NOTIFICATIONS ================= */
router.get(
  "/admin/unread",
  firebaseAuth,
  verifyAdmin,
  getUnreadNotifications
);

/* ================= MARK SINGLE AS READ ================= */
router.put(
  "/read/:id",
  firebaseAuth,
  verifyAdmin,
  markNotificationRead
);

/* ================= MARK ALL AS READ ================= */
router.put("/admin/read-all", firebaseAuth, verifyAdmin, markAllAsRead);

router.put("/department/read-all", firebaseAuth, verifyDepartment, markAllAsRead);

router.put("/user/read-all", firebaseAuth, markAllAsRead);

/* ================= DELETE NOTIFICATION ================= */
router.delete(
  "/:id",
  firebaseAuth,
  verifyAdmin,
  deleteNotification
);

/*===================Department MODEL================= */
router.get(
  "/department",
  firebaseAuth,
  verifyDepartment,
  getDepartmentNotifications
);
export default router;
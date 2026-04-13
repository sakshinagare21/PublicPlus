import express from "express";
import { firebaseAuth, verifyAdmin, verifyDepartment, verifyOperator, attachUser } from "../middleware/firebase.middleware.js";

import {
  getAdminNotifications,
  markNotificationRead,
  getUnreadNotifications,
  deleteNotification,
  markAllAsRead,
  getDepartmentNotifications,
  getUserNotifications,
  markUserNotificationRead,
  getOperatorNotifications,
  getUnreadCount
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

router.put("/operator/read-all", firebaseAuth, verifyOperator, markAllAsRead);

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

/* ================= OPERATOR NOTIFICATIONS ================= */
router.get(
  "/operator",
  firebaseAuth,
  verifyOperator,
  getOperatorNotifications
);

/* ================= USER NOTIFICATIONS ================= */
router.get("/user", firebaseAuth, attachUser, getUserNotifications);
router.put("/user/read/:id", firebaseAuth, attachUser, markUserNotificationRead);
router.put("/user/read-all", firebaseAuth, attachUser, markAllAsRead);

router.get("/unread-count", firebaseAuth, getUnreadCount);

export default router;
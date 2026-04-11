import dotenv from "dotenv";
dotenv.config({ path: "./.env" });
import Notification from "../models/notification.model.js";
import { io } from "../server.js"; // ✅ using your existing io

export const sendNotification = async ({
  title,
  message,
  type,
  targetRole,
  userId = null,
  departmentId = null,
  operatorId = null,
  issueId = null,
  createdBy,
  createdByModel
}) => {
  try {
    /* ================= SAVE ================= */
    const notification = await Notification.create({
      title,
      message,
      type,
      targetRole,
      userId,
      departmentId,
      operatorId,
      issueId,
      createdBy,
      createdByModel
    });

    /* ================= SOCKET ================= */

    // 👤 User
    if (userId) {
      io.to(userId.toString()).emit("notification", notification);
    }

    // 🏢 Department
    if (departmentId) {
      io.to(departmentId.toString()).emit("notification", notification);
    }

    // 👷 Operator
    if (operatorId) {
      io.to(operatorId.toString()).emit("notification", notification);
    }

    return notification;

  } catch (error) {
    console.log("Notification Error:", error.message);
  }
};
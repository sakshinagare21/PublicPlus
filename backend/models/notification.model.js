import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({

  title: {
    type: String,
    required: true
  },

  message: {
    type: String,
    required: true
  },

  type: {
    type: String,
    enum: [
      "department_request",
      "department_approved",
      "department_rejected",
      "operator_approved",
      "operator_rejected",
      "issue_created",
      "issue_resolved"
    ],
    required: true
  },

  targetRole: {
    type: String,
    enum: ["admin", "department", "user"], // ✅ added user
    required: true
  },

  /* 🔥 TARGET IDS */
  departmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Department",
    default: null
  },

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null
  },

  /* who triggered */
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: "createdByModel"
  },

  createdByModel: {
    type: String,
    enum: ["Admin", "Department", "User"]
  },

  isRead: {
    type: Boolean,
    default: false
  }

}, { timestamps: true });

export default mongoose.model("Notification", notificationSchema);
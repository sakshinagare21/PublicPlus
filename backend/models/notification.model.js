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
      "issue_resolved",
      "verification_required",
      "issue_reopened",
      "task_escalated",
      "trust_update",
      "task_unassigned"
    ],
    required: true
  },

  targetRole: {
    type: String,
    enum: ["admin", "department", "user", "operator", "citizen"],
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
  operatorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Operator",
    default: null
  },
  issueId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Issue",
    default: null
  },

  /* 🔥 ESCALATION PROOF */
  escalation: {
    reason: { type: String, default: null },
    proof: { type: String, default: null }
  },

  /* who triggered */
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: "createdByModel"
  },

  createdByModel: {
    type: String,
    enum: ["Admin", "Department", "User", "Operator"]
  },

  isRead: {
    type: Boolean,
    default: false
  }

}, { timestamps: true });

export default mongoose.model("Notification", notificationSchema);

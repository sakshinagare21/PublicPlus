import mongoose from "mongoose";

const adminSchema = new mongoose.Schema(
  {
    /* ================= FIREBASE LINK ================= */

    firebaseUID: {
      type: String,
      required: true,
      unique: true,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
    },

    /* ================= ROLE & HIERARCHY ================= */

    role: {
      type: String,
      enum: ["super_admin", "city_admin", "auditor"],
      default: "city_admin",
    },

    accessLevel: {
      type: Number, // 1 = highest
      default: 2,
    },

    assignedCity: String,


    /* ================= PERMISSIONS ================= */

    permissions: [
      {
        type: String,
        enum: [
          "MANAGE_USERS",
          "MANAGE_DEPARTMENTS",
          "ASSIGN_TASKS",
          "OVERRIDE_ROUTING",
          "VIEW_ANALYTICS",
          "CONFIGURE_SLA",
          "SYSTEM_SETTINGS",
          "AI_CONFIGURATION",
          "ESCALATION_CONTROL",
        ],
      },
    ],


    /* ================= DASHBOARD SETTINGS ================= */

    dashboardPreferences: {
      defaultView: String,
      theme: String,
      showHeatmap: {
        type: Boolean,
        default: true,
      },
    },


    /* ================= SECURITY & TRACKING ================= */

    accountStatus: {
      type: String,
      enum: ["active", "suspended"],
      default: "active",
    },

    lastLogin: Date,

    loginHistory: [
      {
        ipAddress: String,
        deviceInfo: String,
        loginTime: Date,
      },
    ],


    /* ================= ACTIVITY LOG ================= */

    activityLogs: [
      {
        action: String,
        targetId: mongoose.Schema.Types.ObjectId,
        targetModel: String,
        timestamp: Date,
      },
    ],


    /* ================= SYSTEM CONTROL ================= */

    slaSettings: {
      defaultResponseTimeHours: Number,
      defaultResolutionTimeHours: Number,
    },

    aiConfiguration: {
      severityThreshold: Number,
      autoRoutingEnabled: Boolean,
      duplicateDetectionEnabled: Boolean,
    },
  },
  {
    timestamps: true,
  }
);

const Admin = mongoose.model("Admin", adminSchema);

export default Admin;
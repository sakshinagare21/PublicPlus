import mongoose from "mongoose";

const departmentSchema = new mongoose.Schema(
{
  /* ================= BASIC INFO ================= */

  departmentName: {
    type: String,
    required: true,
    unique: true,
  },

  departmentCode: {
    type: String,
    required: true,
    unique: true,
  },

  description: String,

  contactPhone: {
    type: String,
    required: true
  },

  officeAddress: {
    type: String,
    required: true
  },

  city: {
    type: String,
    required: true
  },

  /* ================= FIREBASE AUTH ================= */

  firebaseUID: {
    type: String,
    required: true,
    unique: true
  },

  email: {
    type: String,
    required: true,
    unique: true
  },

  /* ================= ROLE ================= */

  role: {
    type: String,
    enum: ["department_admin"],
    default: "department_admin"
  },

  /* ================= ACCOUNT STATUS ================= */

  accountStatus: {
    type: String,
    enum: ["active", "suspended"],
    default: "active"
  },

  /* ================= ADMIN APPROVAL ================= */

  approvalStatus: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending"
  },

  approvalInfo: {
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin"
    },
    approvedAt: Date
  },

  lastLogin: Date,

  /* ================= ZONES ================= */

  assignedZones: [
    {
      zoneName: String,
      zoneCode: String
    }
  ],

  /* ================= OPERATORS ================= */

  operators: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Operator"
    }
  ],

  pendingOperators: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Operator"
    }
  ],

  /* ================= PERFORMANCE ================= */

  performanceMetrics: {
    totalIssuesHandled: {
      type: Number,
      default: 0
    },

    completedIssues: {
      type: Number,
      default: 0
    },

    averageResolutionTime: Number,
    slaComplianceRate: Number,
    reopenRate: Number
  },

  /* ================= SLA ================= */

  slaSettings: {
    responseTimeHours: Number,
    resolutionTimeHours: Number,
    escalationEnabled: Boolean
  },

  /* ================= DASHBOARD ================= */

  dashboardPreferences: {
    defaultView: String,
    theme: String,
    showHeatmap: {
      type: Boolean,
      default: true
    }
  },

  /* ================= NOTIFICATIONS ================= */

  notificationSettings: {
    slaAlerts: Boolean,
    citizenFeedbackAlerts: Boolean,
    escalationAlerts: Boolean
  },
  /*=======issue types=================*/
 issueTypes: [
  {
    type: String,
    enum: [
      "pothole",
      "road_damage",
      "garbage",
      "drain",
      "water",
      "streetlight",
      "traffic_signal",
      "encroachment",
      "public_toilet",
      "fire"
    ],
  },
],

  /* ================= ACTIVITY ================= */

  activityLogs: [
    {
      action: String,
      targetModel: String,
      targetId: mongoose.Schema.Types.ObjectId,
      timestamp: Date
    }
  ]
},
{
  timestamps: true
}
);

const Department = mongoose.model("Department", departmentSchema);

export default Department;
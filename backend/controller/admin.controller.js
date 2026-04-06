/* Admin Dashboard Controller */
import User from "../models/user.model.js";
import Department from "../models/department.model.js";
import Operator from "../models/operator.model.js";
import Issue from "../models/issue.model.js";
import Zone from "../models/zone.model.js";
import { io } from "../server.js";
import Notification from "../models/notification.model.js";
/*==================Department decision============*/
//get all pending departments request
export const getPendingDepartments = async (req, res) => {
  const departments = await Department.find({
    approvalStatus: "pending",
  });

  res.json(departments);
};

//aprove or reject department registration
import { sendDepartmentApprovedEmail } from "../utils/email.js";
export const approveDepartment = async (req, res) => {
  const department = await Department.findById(req.params.id);
  if (!department) {
    return res.status(404).json({
      message: "Department not found",
    });
  }
  department.approvalStatus = "approved";

  department.approvalInfo = {
    approvedBy: req.admin._id,
    approvedAt: new Date(),
  };

  await department.save();
  //send real time notification to department
  await Notification.create([
    {
      title: "Department Approved",
      message: `${department.departmentName} has been approved`,
      type: "department_approved",
      targetRole: "department",
      departmentId: department._id,
    },
    {
      title: "Department Approved",
      message: `${department.departmentName} approved by admin`,
      type: "department_approved",
      targetRole: "admin",
    },
  ]);

  io.emit("department-approved", {
    departmentName: department.departmentName,
  });
  //send approval email
  await sendDepartmentApprovedEmail(department);
  res.json({
    message: "Department approved",
  });
};

/*reject department registration*/
import { sendDepartmentRejectedEmail } from "../utils/email.js";
export const rejectDepartment = async (req, res) => {
  try {
    const department = await Department.findById(req.params.id);

    if (!department) {
      return res.status(404).json({
        message: "Department not found",
      });
    }

    department.approvalStatus = "rejected";

    await department.save();
    //send real time notification to department
    await Notification.create([
      {
        title: "Department Rejected",
        message: `${department.departmentName} registration rejected`,
        type: "department_rejected",
        targetRole: "department",
        departmentId: department._id,
      },
      {
        title: "Department Rejected",
        message: `${department.departmentName} rejected by admin`,
        type: "department_rejected",
        targetRole: "admin",
      },
    ]);

    io.emit("department-rejected", {
      departmentName: department.departmentName,
    });
    // Send rejection email
    await sendDepartmentRejectedEmail(department);

    res.json({
      message: "Department rejected successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/*get admin dashboard controller*/
import Admin from "../models/superadmin.model.js";

export const getAdminDashboard = async (req, res) => {
  try {
    console.log("FIREBASE USER:", req.firebaseUser);

    const firebaseUID = req.firebaseUser?.uid;

    if (!firebaseUID) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: No UID",
      });
    }

    const admin = await Admin.findOne({ firebaseUID });

    console.log("ADMIN:", admin);

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Admin not found",
      });
    }

    // Update last login
    admin.lastLogin = new Date();
    await admin.save();

    /* ================= STATS ================= */
    const [totalIssues, pendingIssues, resolvedIssues, totalUsers] = await Promise.all([
      Issue.countDocuments(),
      Issue.countDocuments({ status: { $in: ["reported", "assigned", "in_progress"] } }),
      Issue.countDocuments({ status: "resolved" }),
      User.countDocuments({ role: "citizen" })
    ]);

    res.status(200).json({
      success: true,
      admin: {
        id: admin._id,
        email: admin.email,
        role: admin.role,
        status: admin.accountStatus,
      },
      stats: {
        totalIssues,
        pendingIssues,
        resolvedIssues,
        totalUsers,
        resolutionRate: totalIssues > 0 ? Math.round((resolvedIssues / totalIssues) * 100) : 0
      }
    });
  } catch (error) {
    console.error("Dashboard Error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

/*get admin profile*/
export const getAdminProfile = async (req, res) => {
  try {
    const firebaseUID = req.firebaseUser?.uid;
    const admin = await Admin.findOne({ firebaseUID });

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin profile not found",
      });
    }

    res.status(200).json(admin);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*get all department*/
export const getAllDepartments = async (req, res) => {
  try {
    const departments = await Department.find()
      .populate("issueTypes", "name") // optional (good for UI)
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: departments.length,
      departments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*get all operator*/
export const getAllOperators = async (req, res) => {
  try {
    const operators = await Operator.find()
      .populate("departmentId", "departmentName")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: operators.length,
      operators,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*get all zone*/
export const getAllZones = async (req, res) => {
  try {
    const zones = await Zone.find().sort({ areaName: 1 });
    res.status(200).json({
      success: true,
      count: zones.length,
      zones,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*get all user*/

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      count: users.length,
      users,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/*get all account*/
export const getAllAccounts = async (req, res) => {
  try {
    const users = await User.find();
    const operators = await Operator.find();
    const departments = await Department.find();

    /* ================= FORMAT USERS ================= */

    const citizens = users.map((u) => ({
      _id: u._id,
      name: u.fullName || "N/A",
      email: u.email,
      role: "Citizen",
      trust: u.trustMetrics?.trustScore || 50,
      status: u.accountStatus?.toUpperCase(),
    }));

    const ops = operators.map((o) => ({
      _id: o._id,
      name: o.fullName,
      email: o.email,
      role: "Operator",
      trust: o.trustScore || 50,
      status: o.status?.toUpperCase(),
    }));

    const admins = departments.map((d) => ({
      _id: d._id,
      name: d.departmentName,
      email: d.email,
      role: "Admin",
      trust: 80,
      status: d.accountStatus?.toUpperCase(),
    }));

    const all = [...citizens, ...ops, ...admins];

    /* ================= COUNTS & ANALYTICS ================= */
    const citizenTrusts = citizens.map(c => c.trust);
    const avgTrust = citizenTrusts.length > 0
      ? Math.round(citizenTrusts.reduce((a, b) => a + b, 0) / citizenTrusts.length)
      : 50;

    const counts = {
      citizens: citizens.length,
      operators: ops.length,
      admins: admins.length,
      total: all.length,
      avgCitizenTrust: avgTrust,
      flagged: all.filter(u => u.status === "FLAGGED").length,
      suspended: all.filter(u => u.status === "SUSPENDED" || u.status === "BLOCKED").length,
      active: all.filter(u => u.status === "ACTIVE").length,
    };

    res.json({
      success: true,
      counts,
      users: all,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/* Update User Trust Score */
export const updateTrustScore = async (req, res) => {
  try {
    const { id } = req.params;
    const { trustScore, reason } = req.body;

    console.log(`[TRUST UPDATE] CALIBRATING ID: ${id} NEW SCORE: ${trustScore}`);

    // Check Citizens first
    let account = await User.findById(id);
    let modelType = "citizen";

    // If not a citizen, check Operators
    if (!account) {
      account = await Operator.findById(id);
      modelType = "operator";
    }

    if (!account) {
      console.error(`[TRUST ERROR] ID ${id} NOT FOUND IN CITIZEN OR OPERATOR`);
      return res.status(404).json({
        success: false,
        message: `Database mismatch: Node ID ${id} not found in verified registry.`,
      });
    }

    // Update trust score based on model schema
    if (modelType === "citizen") {
      account.trustMetrics = {
        ...account.trustMetrics,
        trustScore: trustScore,
      };
    } else {
      account.trustScore = trustScore;
    }

    await account.save();

    // Create notification
    await Notification.create({
      userId: modelType === "citizen" ? account._id : null,
      operatorId: modelType === "operator" ? account._id : null,
      title: "Trust Score Updated",
      message: `Admin updated your trust score to ${trustScore}% due to: ${reason}`,
      type: "trust_update",
      targetRole: modelType,
    });

    res.json({
      success: true,
      message: "Score adjusted successfully",
      newScore: trustScore,
    });
  } catch (error) {
    console.error(`[TRUST EXCEPTION] ${error.message}`);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

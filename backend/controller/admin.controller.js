
/* Admin Dashboard Controller */
import User from "../models/user.model.js";
import Department from "../models/department.model.js";
import Issue from "../models/issue.model.js";
import { io } from "../server.js";
import Notification from "../models/notification.model.js";
/*==================Department decision============*/
//get all pending departments request
export const getPendingDepartments = async (req, res) => {

  const departments = await Department.find({
    approvalStatus: "pending"
  });

  res.json(departments);

};

//aprove or reject department registration
import { sendDepartmentApprovedEmail } from "../utils/email.js";
export const approveDepartment = async (req, res) => {

  const department = await Department.findById(req.params.id);
  if (!department) {
      return res.status(404).json({
        message: "Department not found"
      });
    }
  department.approvalStatus = "approved";

  department.approvalInfo = {
    approvedBy: req.admin._id,
    approvedAt: new Date()
  };

  await department.save();
  //send real time notification to department
  await Notification.create([
  {
    title: "Department Approved",
    message: `${department.departmentName} has been approved`,
    type: "department_approved",
    targetRole: "department",
     departmentId: department._id 
  },
  {
    title: "Department Approved",
    message: `${department.departmentName} approved by admin`,
    type: "department_approved",
    targetRole: "admin"
  }
]);

io.emit("department-approved", {
  departmentName: department.departmentName
});
//send approval email
  await sendDepartmentApprovedEmail(department);
  res.json({
    message: "Department approved"
  });

};

/*reject department registration*/
import { sendDepartmentRejectedEmail } from "../utils/email.js";
export const rejectDepartment = async (req, res) => {

  try {

    const department = await Department.findById(req.params.id);

    if (!department) {
      return res.status(404).json({
        message: "Department not found"
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
    departmentId: department._id 
    
  },
  {
    title: "Department Rejected",
    message: `${department.departmentName} rejected by admin`,
    type: "department_rejected",
    targetRole: "admin"
  }
]);

io.emit("department-rejected", {
  departmentName: department.departmentName
});
    // Send rejection email
    await sendDepartmentRejectedEmail(department);

    res.json({
      message: "Department rejected successfully"
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }

};


/*get admin dashboard controller*/
export const getAdminDashboard = async (req, res) => {
  try {

    const totalUsers = await User.countDocuments();
    const totalDepartments = await Department.countDocuments();
    const totalIssues = await Issue.countDocuments();

    res.status(200).json({
      admin: req.admin.email,
      role: req.admin.role,
      totalUsers,
      totalDepartments,
      totalIssues,
      dashboardPreferences: req.admin.dashboardPreferences
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


/*create admin*/
export const createAdmin = async (req, res) => {
  try {

    if (req.admin.role !== "super_admin") {
      return res.status(403).json({ message: "Only Super Admin can create admin" });
    }

    const { firebaseUID, email, role, permissions } = req.body;

    const newAdmin = await Admin.create({
      firebaseUID,
      email,
      role,
      permissions
    });

    res.status(201).json({
      message: "Admin created successfully",
      newAdmin
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


/*get all admins controller*/
export const getAllAdmins = async (req, res) => {
  try {

    const admins = await Admin.find().select("-loginHistory");

    res.status(200).json(admins);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/*upadte role and permissions controller*/
export const updateAdmin = async (req, res) => {
  try {

    if (req.admin.role !== "super_admin") {
      return res.status(403).json({ message: "Only Super Admin can update roles" });
    }

    const { role, permissions } = req.body;

    const admin = await Admin.findById(req.params.adminId);

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    admin.role = role || admin.role;
    admin.permissions = permissions || admin.permissions;

    await admin.save();

    res.status(200).json({ message: "Admin updated successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/*update admin status controller*/
export const updateAdminStatus = async (req, res) => {
  try {

    if (req.admin.role !== "super_admin") {
      return res.status(403).json({ message: "Only Super Admin allowed" });
    }

    const admin = await Admin.findById(req.params.adminId);

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    admin.accountStatus = req.body.status;

    await admin.save();

    res.status(200).json({ message: "Admin status updated" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/*update sla settings controller*/
export const updateSLASettings = async (req, res) => {
  try {

    if (!req.admin.permissions.includes("CONFIGURE_SLA")) {
      return res.status(403).json({ message: "Permission denied" });
    }

    req.admin.slaSettings = req.body;

    await req.admin.save();

    res.status(200).json({ message: "SLA settings updated" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/*UPDATE AI ANALYTICS SETTINGS CONTROLLER*/
export const updateAIConfiguration = async (req, res) => {
  try {

    if (!req.admin.permissions.includes("AI_CONFIGURATION")) {
      return res.status(403).json({ message: "Permission denied" });
    }

    req.admin.aiConfiguration = req.body;

    await req.admin.save();

    res.status(200).json({ message: "AI configuration updated" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/*admin logactivity log controller*/
export const addAdminActivityLog = async (req, res) => {
  try {

    const { action, targetId, targetModel } = req.body;

    req.admin.activityLogs.push({
      action,
      targetId,
      targetModel,
      timestamp: new Date()
    });

    await req.admin.save();

    res.status(200).json({ message: "Activity logged" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/*update admin dashboard preferences controller*/
export const updateDashboardPreferences = async (req, res) => {
  try {

    req.admin.dashboardPreferences = req.body;

    await req.admin.save();

    res.status(200).json({ message: "Preferences updated" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
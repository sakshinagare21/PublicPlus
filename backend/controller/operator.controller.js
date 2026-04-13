/*get operator dashboard stats controller*/
import Operator from "../models/operator.model.js";
import { sendOperatorRequestEmail } from "../utils/email.js";
import { io } from "../server.js";
import Issue from "../models/issue.model.js";
/*register operator controller */
import Department from "../models/department.model.js";
import Notification from "../models/notification.model.js";
import admin from "../config/firebase.js";

/* Delete and Decommission Operator */
export const deleteOperator = async (req, res) => {
  try {
    const { operatorId } = req.params;
    const departmentId = req.department._id;

    const operator = await Operator.findOne({ _id: operatorId, departmentId });

    if (!operator) {
      return res.status(404).json({ message: "Operator not found in your department" });
    }

    // 1. Move all non-completed issues to "unassigned" status
    const affectedIssues = await Issue.find({
      assignedTo: operatorId,
      status: { $in: ["assigned", "in_progress", "escalated"] }
    });

    if (affectedIssues.length > 0) {
      await Issue.updateMany(
        { assignedTo: operatorId, status: { $in: ["assigned", "in_progress", "escalated"] } },
        {
          $set: { assignedTo: null, status: "reported" },
          $push: {
            statusHistory: {
              status: "reported",
              remark: `Automatically unassigned due to operator (${operator.fullName}) removal.`,
              updatedAt: new Date()
            }
          }
        }
      );

      // 2. Notify Department Admin about the orphaned tasks
      await Notification.create({
        title: "Urgent: Unassigned Tasks",
        message: `${operator.fullName} was removed. ${affectedIssues.length} tasks are now unassigned and require immediate attention.`,
        type: "task_unassigned",
        targetRole: "department",
        departmentId: departmentId,
      });
    }

    // 3. Remove from Department's operators list
    await Department.findByIdAndUpdate(departmentId, {
        $pull: { operators: operatorId }
    });

    // 🔥 FIREBASE AUTH SYNC: Remove from Firebase Authentication
    if (operator.firebaseUID) {
        try {
            await admin.auth().deleteUser(operator.firebaseUID);
            console.log(`Firebase Identity node ${operator.firebaseUID} removed.`);
        } catch (fbError) {
            console.error("Firebase Deletion Error:", fbError.message);
            // We continue even if Firebase delete fails (e.g. user already deleted manually)
        }
    }

    // 🔥 MONGO DELETE
    await Operator.findByIdAndDelete(operatorId);

    // 5. Emit real-time alert
    io.to(departmentId.toString()).emit("operator-removed", {
      operatorName: operator.fullName,
      unassignedCount: affectedIssues.length
    });

    res.status(200).json({
      success: true,
      message: `Operator removed successfully. ${affectedIssues.length} tasks have been returned to the unassigned pool.`
    });

  } catch (error) {
    console.error("Delete Operator Error:", error);
    res.status(500).json({ message: error.message });
  }
};


export const registerOperator = async (req, res) => {
 try {
 const { uid, email } = req.firebaseUser;

 const { fullName, phoneNumber, departmentId } = req.body;

 /* check department exists */

 const department = await Department.findById(departmentId);

 if (!department) {
 return res.status(404).json({
 message: "Department not found",
 });
 }

 /* check operator already exists */

 const exists = await Operator.findOne({
 email,
 });

 if (exists) {
 return res.status(400).json({
 message: "Operator already registered",
 });
 }

 /* create operator */

 const operator = await Operator.create({
 firebaseUID: uid,
 email,
 fullName,
 phoneNumber,
 departmentId,
 approvalStatus: "pending",
 status: "inactive",
 });

 /* send email to department */

 await sendOperatorRequestEmail(operator, department.email);

 /* add operator to pending list */

 department.pendingOperators.push(operator._id);

 await department.save();

 res.status(201).json({
 message: "Operator request sent to department",
 });
 } catch (error) {
 res.status(500).json({
 message: error.message,
 });
 }
};

/*operator login controller */
export const operatorLogin = async (req, res) => {
 const operator = req.operator;

 if (operator.approvalStatus !== "approved") {
 return res.status(403).json({
 message: "Operator not approved by department",
 });
 }

 if (operator.status !== "active") {
 return res.status(403).json({
 message: "Operator account suspended",
 });
 }

 operator.lastLogin = new Date();
 operator.loginHistory.push({
  ipAddress: req.ip,
  deviceInfo: req.headers["user-agent"],
  loginTime: new Date(),
 });

 await operator.save();

 res.json({
 message: "Operator login successful",
 operator,
 });
};


export const getOperatorDashboard = async (req, res) => {
 try {
 const operatorId = req.operator._id;

 const total = await Task.countDocuments({ operatorId });
 const pending = await Task.countDocuments({
 operatorId,
 status: "pending",
 });
 const inProgress = await Task.countDocuments({
 operatorId,
 status: "in_progress",
 });
 const completed = await Task.countDocuments({
 operatorId,
 status: "completed",
 });

 res.status(200).json({
 total,
 pending,
 inProgress,
 completed,
 });
 } catch (error) {
 res.status(500).json({ message: error.message });
 }
};

/*get operator profile controller*/
//for log in operator to view own profile and for department to view operator profile and stats
export const getOperatorProfile = async (req, res) => {
 try {
 const operatorId = req.params.operatorId || req.operator._id;

 const operator = await Operator.findById(operatorId)
 .populate("departmentId", "departmentName");

 if (!operator) {
 return res.status(404).json({ message: "Operator not found" });
 }

 res.status(200).json(operator);

 } catch (error) {
 res.status(500).json({ message: error.message });
 }
};


/*for department viewing operator stats*/
export const getOperatorProfileByDept = async (req, res) => {
 try {
 const { operatorId } = req.params;

 const operator = await Operator.findOne({
 _id: operatorId,
 departmentId: req.department._id, // ✅ security check
 }).populate("departmentId", "departmentName");

 if (!operator) {
 return res.status(404).json({
 message: "Operator not found or not in your department",
 });
 }

 res.status(200).json(operator);
 } catch (error) {
 res.status(500).json({ message: error.message });
 }
};

/*get operator statistics for department*/
export const getOperatorStatsByDept = async (req, res) => {
 try {
 const { operatorId } = req.params;

 // ✅ verify operator belongs to department
 const operator = await Operator.findOne({
 _id: operatorId,
 departmentId: req.department._id,
 });

 if (!operator) {
 return res.status(404).json({
 message: "Operator not found",
 });
 }

 const total = await Issue.countDocuments({
 assignedTo: operatorId,
 });

 const pending = await Issue.countDocuments({
 assignedTo: operatorId,
 status: "reported",
 });

 const inProgress = await Issue.countDocuments({
 assignedTo: operatorId,
 status: "in_progress",
 });

 const completed = await Issue.countDocuments({
 assignedTo: operatorId,
 status: "resolved",
 });

 res.json({
 total,
 pending,
 inProgress,
 completed,
 });

 } catch (error) {
 res.status(500).json({ message: error.message });
 }
};

import mongoose from "mongoose";
import Department from "../models/department.model.js";
import Issue from "../models/issue.model.js";
import Operator from "../models/operator.model.js";
import { sendDepartmentRegistrationEmail } from "../utils/email.js";
import { io } from "../server.js";
import Notification from "../models/notification.model.js";
import {
 sendOperatorApprovedEmail,
 sendOperatorRejectedEmail,
} from "../utils/email.js";
import Zone from "../models/zone.model.js";
/*==================Register Department Admin=================*/

export const registerDepartment = async (req, res) => {
 try {
 const { uid, email } = req.firebaseUser;

 const {
 departmentName,
 departmentCode,
 description,
 contactPhone,
 officeAddress,
 city,
 } = req.body;

 /* Check duplicate */

 const exists = await Department.findOne({
 $or: [{ departmentCode }, { email }],
 });

 if (exists) {
 return res.status(400).json({
 message: "Department already exists",
 });
 }

 /* Fetch all active zones to assign by default */
 const allZones = await Zone.find();
 const assignedZones = allZones.map(z => ({
 zoneName: z.areaName,
 zoneCode: z.zoneId
 }));

 /* Create department */

 const department = await Department.create({
 departmentName,
 departmentCode,
 description,
 contactPhone,
 officeAddress,
 city,
 firebaseUID: uid,
 email,
 approvalStatus: "pending",
 assignedZones: assignedZones, // Dynamically assigned from Zone model
 });

 /* Send email to admin */
 await sendDepartmentRegistrationEmail(department);

 /* Save notification in database */
 await Notification.create({
 title: "New Department Request",
 message: `${department.departmentName} requested access`,
 type: "department_request",
 targetRole: "admin",
 departmentId: department._id, // 🔥 IMPORTANT
 });

 /* Real-time notification */
 io.emit("new-department-request", {
 departmentName: department.departmentName,
 departmentCode: department.departmentCode,
 });

 res.status(201).json({
 message:
 "Department registered successfully. Waiting for admin approval.",
 });
 } catch (error) {
 console.log("REGISTER ERROR FULL:", error);

 res.status(500).json({
 message: error.message,
 });
 }
};

export const departmentLogin = async (req, res) => {
 try {
 const department = req.department;

 /* Check approval */

 if (department.approvalStatus !== "approved") {
 return res.status(403).json({
 message: "Department not approved by admin yet",
 });
 }

 /* Check suspension */

 if (department.accountStatus !== "active") {
 return res.status(403).json({
 message: "Department account suspended",
 });
 }

 /* update login */

 department.lastLogin = new Date();

 await department.save();

 res.json({
 message: "Login successful",
 department,
 });
 } catch (error) {
 res.status(500).json({
 message: error.message,
 });
 }
};

/*operator approve*/
export const approveOperator = async (req, res) => {
 try {
 const { zoneName, zoneCode } = req.body;

 if (!zoneName || !zoneCode) {
 return res.status(400).json({
 message: "Zone must be assigned before approving operator",
 });
 }

 const operator = await Operator.findById(req.params.operatorId);

 if (!operator) {
 return res.status(404).json({
 message: "Operator not found",
 });
 }

 /* approve operator */

 operator.approvalStatus = "approved";
 operator.status = "active";

 /* assign zone */

 operator.assignedZone = {
 zoneName,
 zoneCode,
 };

 await operator.save();
 /*save nofification in database*/
 /* 🔔 NOTIFICATION */
 await Notification.create({
 title: "Operator Approved",
 message: `${operator.fullName} approved for zone ${zoneName}`,
 type: "operator_approved",
 targetRole: "department",
 departmentId: req.department._id, // 🔥 IMPORTANT
 operatorId: operator._id, // 🔥 IMPORTANT
 });
 /* move operator in department */

 await Department.findByIdAndUpdate(req.department._id, {
 $pull: { pendingOperators: operator._id },
 $push: { operators: operator._id },
 });

 /* send email */

 await sendOperatorApprovedEmail(operator);

 res.json({
 message: "Operator approved and zone assigned successfully",
 });
 } catch (error) {
 res.status(500).json({ message: error.message });
 }
};

/*reject operator*/
export const rejectOperator = async (req, res) => {
 const operator = await Operator.findById(req.params.operatorId);

 operator.approvalStatus = "rejected";

 await operator.save();
 /* 🔔 NOTIFICATION */
 await Notification.create({
 title: "Operator Rejected",
 message: `${operator.fullName} has been rejected`,
 type: "operator_rejected",
 targetRole: "department",
 departmentId: req.department._id, // 🔥 IMPORTANT
 operatorId: operator._id, // 🔥 IMPORTANT
 });
 await Department.findByIdAndUpdate(req.department._id, {
 $pull: { pendingOperators: operator._id },
 });

 await sendOperatorRejectedEmail(operator);

 res.json({
 message: "Operator rejected",
 });
};

/*get all department*/
export const getDepartments = async (req, res) => {
 try {
 const departments = await Department.find().select(
 "_id departmentName assignedZones",
 );

 res.status(200).json(departments);
 } catch (error) {
 res.status(500).json({ message: error.message });
 }
};
/*get all zone of particular department*/

export const getMyZones = async (req, res) => {
 try {
 const department = req.department;

 res.status(200).json(department.assignedZones);
 } catch (error) {
 res.status(500).json({
 message: error.message,
 });
 }
};

/*get pending operators of department*/
export const getPendingOperators = async (req, res) => {
 try {
 const operators = await Operator.find({
 departmentId: req.department._id,
 approvalStatus: "pending",
 });

 res.status(200).json(operators);
 } catch (error) {
 res.status(500).json({ message: error.message });
 }
};


/*========update issue types of department controller========*/


export const updateIssueTypes = async (req, res) => {
 try {
 const departmentId = req.department?._id;
 const { issueTypes } = req.body;

 console.log("REQ BODY:", req.body);

 // ✅ 1. VALIDATE
 if (!issueTypes || !Array.isArray(issueTypes)) {
 return res.status(400).json({
 message: "issueTypes must be a valid array"
 });
 }

 // ✅ 2. FILTER INVALID IDS
 const validIds = issueTypes.filter(id =>
 mongoose.Types.ObjectId.isValid(id)
 );

 if (validIds.length === 0) {
 return res.status(400).json({
 message: "No valid issue types selected"
 });
 }

 // ✅ 3. FIND DEPARTMENT
 const department = await Department.findById(departmentId);

 if (!department) {
 return res.status(404).json({
 message: "Department not found"
 });
 }

 const existingTypes = department.issueTypes || [];

 const mergedTypes = [
 ...new Set([
 ...existingTypes.map(id => id.toString()),
 ...validIds
 ])
 ];

 // ✅ 4. DUPLICATE CHECK
 const existing = await Department.find({
 _id: { $ne: departmentId },
 issueTypes: { $in: mergedTypes }
 });

 if (existing.length > 0) {
 return res.status(400).json({
 message: "Issue type already assigned to another department"
 });
 }

 // ✅ 5. SAVE
 department.issueTypes = mergedTypes.map(
 id => new mongoose.Types.ObjectId(id)
 );

 await department.save();

 res.json({
 message: "Updated successfully",
 department
 });

 } catch (error) {
 console.log("🔥 FINAL ERROR:", error); // IMPORTANT
 res.status(500).json({
 message: error.message
 });
 }
};

/*=================taken issue types of department controller=================*/
export const getTakenIssueTypes = async (req, res) => {
 try {
 const departments = await Department.find()
 .populate("issueTypes", "name"); // 🔥 important

 let taken = [];

 departments.forEach((dept) => {
 dept.issueTypes.forEach((type) => {
 taken.push({
 _id: type._id,
 name: type.name
 });
 });
 });

 res.json({
 success: true,
 taken
 });

 } catch (err) {
 res.status(500).json({
 success: false,
 message: err.message
 });
 }
};


/*=================get department===========*/
export const getMyDepartment = async (req, res) => {
 try {
 /* ================= GET DEPARTMENT ================= */
 const department = await Department.findById(req.department._id)
 .select("-__v -activityLogs"); // hide unnecessary fields

 if (!department) {
 return res.status(404).json({
 message: "Department not found",
 });
 }

 /* ================= RESPONSE ================= */
 res.status(200).json(department);

 } catch (error) {
 res.status(500).json({
 message: error.message,
 });
 }
};

/*===========get department operator */
// controller/department.controller.js

export const getDepartmentOperators = async (req, res) => {
 try {
 const department = await Department.findById(req.department._id)
 .populate(
 "operators",
 "fullName email assignedZone currentActiveTasks maxCapacity status"
 );

 // ✅ REMOVE DUPLICATES HERE
 const uniqueOperators = Array.from(
 new Map(
 department.operators.map(op => [op._id.toString(), op])
 ).values()
 );

 res.json(uniqueOperators);

 } catch (error) {
 res.status(500).json({ message: error.message });
 }
};
/*get operator detail*/
export const getOperatorDetails = async (req, res) => {
 try {
 const { operatorId } = req.params;

 const issues = await Issue.find({
 assignedTo: operatorId,
 })
 .populate("assignedDepartment", "departmentName")
 .sort({ createdAt: -1 });

 const total = issues.length;

 const pending = issues.filter(i => i.status === "reported").length;
 const inProgress = issues.filter(i => i.status === "in_progress").length;
 const completed = issues.filter(i => i.status === "resolved").length;

 res.json({
 total,
 pending,
 inProgress,
 completed,
 issues,
 });

 } catch (error) {
 res.status(500).json({ message: error.message });
 }
};



/********** get department dashboard stats controller **********/
export const getDepartmentDashboard = async (req, res) => {
 try {
 const department = req.department;

 res.status(200).json({
 departmentName: department.departmentName,
 departmentCode: department.departmentCode,
 assignedZones: department.assignedZones,
 performanceMetrics: department.performanceMetrics,
 slaSettings: department.slaSettings,
 notificationSettings: department.notificationSettings,
 dashboardPreferences: department.dashboardPreferences,
 });
 } catch (error) {
 res.status(500).json({ message: error.message });
 }
};

/********** get all issues assigned to department controller **********/
export const getDepartmentIssues = async (req, res) => {
 try {
 const issues = await Issue.find({
 assignedDepartment: req.department._id,
 });

 res.status(200).json(issues);
 } catch (error) {
 res.status(500).json({ message: error.message });
 }
};

/*add zone to department controller*/
export const addZone = async (req, res) => {
 try {
 const { zoneName, zoneCode } = req.body;

 req.department.assignedZones.push({ zoneName, zoneCode });

 await req.department.save();

 res.status(200).json({ message: "Zone added successfully" });
 } catch (error) {
 res.status(500).json({ message: error.message });
 }
};

/*remove zone from department controller*/
export const removeZone = async (req, res) => {
 try {
 const { zoneCode } = req.params;

 req.department.assignedZones = req.department.assignedZones.filter(
 (z) => z.zoneCode !== zoneCode,
 );

 await req.department.save();

 res.status(200).json({ message: "Zone removed successfully" });
 } catch (error) {
 res.status(500).json({ message: error.message });
 }
};

/*update sla settings controller*/
export const updateSLASettings = async (req, res) => {
 try {
 const { responseTimeHours, resolutionTimeHours, escalationEnabled } =
 req.body;

 req.department.slaSettings = {
 responseTimeHours,
 resolutionTimeHours,
 escalationEnabled,
 };

 await req.department.save();

 res.status(200).json({ message: "SLA settings updated" });
 } catch (error) {
 res.status(500).json({ message: error.message });
 }
};

/*update notification settings controller*/
export const updateNotificationSettings = async (req, res) => {
 try {
 req.department.notificationSettings = req.body;

 await req.department.save();

 res.status(200).json({ message: "Notification settings updated" });
 } catch (error) {
 res.status(500).json({ message: error.message });
 }
};


/*get performance metrics controller*/
export const getPerformanceMetrics = async (req, res) => {
 try {
 const departmentId = req.department._id;

 const totalIssues = await Issue.countDocuments({
 assignedDepartment: departmentId,
 });

 const completedIssues = await Issue.countDocuments({
 assignedDepartment: departmentId,
 status: "resolved",
 });

 const slaComplianceRate =
 totalIssues === 0 ? 0 : (completedIssues / totalIssues) * 100;

 req.department.performanceMetrics.totalIssuesHandled = totalIssues;
 req.department.performanceMetrics.completedIssues = completedIssues;
 req.department.performanceMetrics.slaComplianceRate = slaComplianceRate;

 await req.department.save();

 res.status(200).json(req.department.performanceMetrics);
 } catch (error) {
 res.status(500).json({ message: error.message });
 }
};

/*add activity log*/
export const addActivityLog = async (req, res) => {
 try {
 const { action, targetModel, targetId } = req.body;

 req.department.activityLogs.push({
 action,
 targetModel,
 targetId,
 timestamp: new Date(),
 });

 await req.department.save();

 res.status(200).json({ message: "Activity logged" });
 } catch (error) {
 res.status(500).json({ message: error.message });
 }
};
export const getAllAvailableZones = async (req, res) => {
 try {
 const zones = await Zone.find();
 res.status(200).json(zones);
 } catch (error) {
 res.status(500).json({ message: error.message });
 }
};

export const getDetailedReports = async (req, res) => {
 try {
 const departmentId = req.department._id;

 // Fetch all issues for this department
 const issues = await Issue.find({ assignedDepartment: departmentId })
 .populate("assignedTo", "fullName email")
 .populate("category", "name");

 // 1. Monthly Stats (Current Year)
 const currentYear = new Date().getFullYear();
 const monthlyStats = Array(12).fill(0).map((_, i) => ({ 
 month: new Date(2024, i).toLocaleString('default', { month: 'short' }), 
 count: 0 
 }));
 
 // 2. Weekly Stats (Current Month)
 const currentMonth = new Date().getMonth();
 const weeklyStats = Array(5).fill(0).map((_, i) => ({ week: i + 1, count: 0 }));

 // 3. Category & Snapshot Calcs
 const today = new Date();
 today.setHours(0, 0, 0, 0);
 const startOfWeek = new Date(today);
 startOfWeek.setDate(today.getDate() - today.getDay());
 const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

 let todayCount = 0, weekCount = 0, monthCount = 0;
 let totalResolved = 0, totalResolutionTime = 0;
 const categoryMap = {};
 const operatorMap = {};

 issues.forEach(issue => {
 const issueDate = new Date(issue.createdAt);
 
 // Monthly/Weekly Stats
 if (issueDate.getFullYear() === currentYear) {
 monthlyStats[issueDate.getMonth()].count++;
 }
 if (issueDate.getFullYear() === currentYear && issueDate.getMonth() === currentMonth) {
 const week = Math.floor((issueDate.getDate() - 1) / 7);
 if (week < 5) weeklyStats[week].count++;
 }

 // Snapshot Counts
 if (issueDate >= today) todayCount++;
 if (issueDate >= startOfWeek) weekCount++;
 if (issueDate >= startOfMonth) monthCount++;

 // Resolution & Category Analysis
 if (["resolved", "closed"].includes(issue.status)) {
 totalResolved++;
 const duration = (new Date(issue.updatedAt) - new Date(issue.createdAt)) / (1000 * 60 * 60); // hrs
 totalResolutionTime += duration;

 const catName = issue.category?.name || "General";
 if (!categoryMap[catName]) {
 categoryMap[catName] = { name: catName, totalHrs: 0, count: 0 };
 }
 categoryMap[catName].totalHrs += duration;
 categoryMap[catName].count++;
 }

 // Operator Stats
 if (issue.assignedTo) {
 const opId = issue.assignedTo._id.toString();
 if (!operatorMap[opId]) {
 operatorMap[opId] = {
 fullName: issue.assignedTo.fullName,
 email: issue.assignedTo.email,
 reported: 0,
 solved: 0
 };
 }
 operatorMap[opId].reported++;
 if (["resolved", "closed"].includes(issue.status)) {
 operatorMap[opId].solved++;
 }
 }
 });

 const categoryAnalysis = Object.values(categoryMap).map(c => ({
 name: c.name,
 hours: parseFloat((c.totalHrs / c.count).toFixed(1))
 }));

 const avgResolutionTime = totalResolved > 0 ? (totalResolutionTime / totalResolved).toFixed(1) : 0;
 const slaCompliance = issues.length > 0 ? ((totalResolved / issues.length) * 100).toFixed(1) : 0;

 res.status(200).json({
 monthlyStats,
 weeklyStats,
 categoryAnalysis,
 summary: {
 today: todayCount,
 week: weekCount,
 month: monthCount,
 totalResolved,
 avgResolutionTime,
 slaCompliance,
 totalIssues: issues.length
 },
 operatorStats: Object.values(operatorMap),
 reports: req.department.reports || [],
 activityLogs: req.department.activityLogs || []
 });
 } catch (error) {
 res.status(500).json({ message: error.message });
 }
};

export const logReport = async (req, res) => {
 try {
 const { name, type, format, stats } = req.body;
 
 if (!req.department) {
 return res.status(404).json({ message: "Department document missing from request" });
 }

 if (!req.department.reports) {
 req.department.reports = [];
 }

 req.department.reports.unshift({ name, type, format, stats });
 await req.department.save();
 
 res.status(200).json({ 
 message: "Report logged effectively", 
 reports: req.department.reports 
 });
 } catch (error) {
 console.error("LOG_REPORT_ERROR:", error);
 res.status(500).json({ 
 message: error.message,
 stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
 });
 }
};


/*get operator dashboard stats controller*/
import Operator from "../models/operator.model.js";
import { sendOperatorRequestEmail } from "../utils/email.js";
import { io } from "../server.js";
import Issue from "../models/issue.model.js";
/*register operator controller */
import Department from "../models/department.model.js";

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

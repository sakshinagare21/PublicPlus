import Admin from "../models/superadmin.model.js";
import Department from "../models/department.model.js";
import Operator from "../models/operator.model.js";
import User from "../models/user.model.js";

export const detectUserRole = async (req, res) => {
 try {

 const { uid } = req.firebaseUser;

 // Super Admin / City Admin
 const admin = await Admin.findOne({ firebaseUID: uid });

 if (admin) {
 return res.status(200).json({
 role: admin.role,
 dashboard: "admin",
 data: admin
 });
 }

 // Department Admin
 const department = await Department.findOne({ firebaseUID: uid });

 if (department) {
 return res.status(200).json({
 role: "department_admin",
 dashboard: "department",
 data: department
 });
 }

 // Operator
 const operator = await Operator.findOne({ firebaseUID: uid });

 if (operator) {
 return res.status(200).json({
 role: "operator",
 dashboard: "operator",
 data: operator
 });
 }

 // Citizen
 const user = await User.findOne({ firebaseUID: uid });

 if (user) {
 return res.status(200).json({
 role: "citizen",
 dashboard: "citizen",
 data: user
 });
 }

 return res.status(403).json({
 message: "User role not found"
 });

 } catch (error) {
 res.status(500).json({ message: error.message });
 }
};

import admin from "../config/firebase.js";
import User from "../models/user.model.js";

export const firebaseAuth = async (req, res, next) => {
 try {
 const header = req.headers.authorization;

 if (!header || !header.startsWith("Bearer ")) {
 return res.status(401).json({ message: "No token provided" });
 }

 const token = header.split(" ")[1];

 const decoded = await admin.auth().verifyIdToken(token);

 // ✅ Only attach decoded user
 req.firebaseUser = decoded;

 next();

 } catch (error) {
 console.error("Firebase Verify Error:", error);
 res.status(401).json({ message: error.message });
 }
};


/*================== ADMIN MODEL ================= */
import Admin from "../models/superadmin.model.js";

export const verifyAdmin = async (req, res, next) => {
 try {
 // Firebase already verified in firebaseAuth middleware
 if (!req.firebaseUser) {
 return res.status(401).json({ message: "Unauthorized" });
 }

 const mongoAdmin = await Admin.findOne({
 firebaseUID: req.firebaseUser.uid,
 });

 if (!mongoAdmin) {
 return res.status(403).json({ message: "Admin not found" });
 }

 if (mongoAdmin.accountStatus !== "active") {
 return res.status(403).json({ message: "Admin suspended" });
 }

 req.admin = mongoAdmin;

 next();

 } catch (error) {
 console.error("Admin Verify Error:", error);
 res.status(500).json({ message: "Server error" });
 }
};



/*================== DEPARTMENT MODEL ================= */
import Department from "../models/department.model.js";

export const verifyDepartment = async (req, res, next) => {
 try {

 const department = await Department.findOne({
 firebaseUID: req.firebaseUser.uid
 });

 if (!department) {
 return res.status(404).json({
 message: "Department not found"
 });
 }

 if (department.accountStatus !== "active") {
 return res.status(403).json({
 message: "Department suspended"
 });
 }

 if (department.approvalStatus !== "approved") {
 return res.status(403).json({
 message: "Department not approved yet"
 });
 }

 req.department = department;

 next();

 } catch (error) {
 res.status(500).json({ message: error.message });
 }
};

/*================== OPERATOR MODEL ================= */
import Operator from "../models/operator.model.js";

export const verifyOperator = async (req, res, next) => {
 try {

 if (!req.firebaseUser) {
 return res.status(401).json({ message: "Unauthorized" });
 }

 const operator = await Operator.findOne({
 firebaseUID: req.firebaseUser.uid,
 });

 if (!operator) {
 return res.status(403).json({ message: "Operator not found" });
 }

 if (operator.status !== "active") {
 return res.status(403).json({ message: "Operator suspended" });
 }

 req.operator = operator;
 next();

 } catch (error) {
 res.status(500).json({ message: error.message });
 }
};


/*==================Attaching User to Request==================*/

export const attachUser = async (req, res, next) => {
 try {

 // Make sure firebaseAuth ran before
 if (!req.firebaseUser) {
 return res.status(401).json({ message: "Unauthorized" });
 }

 // Find user in MongoDB using Firebase UID
 const user = await User.findOne({
 firebaseUID: req.firebaseUser.uid
 });

 if (!user) {
 return res.status(404).json({ message: "User not found" });
 }

 if (user.status === "suspended") {
 return res.status(403).json({ message: "Account suspended" });
 }

 // Attach full MongoDB user document
 req.user = user;

 next();

 } catch (error) {
 res.status(500).json({ message: error.message });
 }
};

export const restrictCityAdmin = (req,res,next)=>{

 if(req.admin.role === "city_admin"){

 if(req.body.city && req.body.city !== req.admin.assignedCity){
 return res.status(403).json({
 message:"City admin can manage only their city"
 })
 }

 }

 next()
};

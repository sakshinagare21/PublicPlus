import IssueType from "../models/issueType.model.js";

/* ================= ADD ISSUE TYPE ================= */
export const addIssueType = async (req, res) => {
 try {
 const { name } = req.body;

 if (!name) {
 return res.status(400).json({
 message: "Issue type name is required"
 });
 }

 const formattedName = name
 .trim()
 .toLowerCase()
 .replace(/\s+/g, "_");

 const existing = await IssueType.findOne({ name: formattedName });

 if (existing) {
 return res.status(400).json({
 message: "Issue type already exists"
 });
 }

 const issueType = await IssueType.create({
 name: formattedName
 });

 res.status(201).json({
 success: true,
 message: "Issue type added",
 issueType
 });

 } catch (err) {
 res.status(500).json({
 success: false,
 message: err.message
 });
 }
};

/* ================= GET ALL ================= */
const formatLabel = (text) => {
 return text
 .replace(/_/g, " ")
 .replace(/\b\w/g, (c) => c.toUpperCase());
};

export const getIssueTypes = async (req, res) => {
 try {
 const types = await IssueType.find();

 const formatted = types.map((t) => ({
 _id: t._id,
 name: t.name, // original (for logic)
 label: formatLabel(t.name) // 🔥 display
 }));

 res.json({
 success: true,
 types: formatted
 });

 } catch (err) {
 res.status(500).json({
 message: err.message
 });
 }
};
/* ================= DELETE ================= */
export const deleteIssueType = async (req, res) => {
 try {
 const { id } = req.params;

 await IssueType.findByIdAndDelete(id);

 res.json({
 success: true,
 message: "Issue type deleted"
 });

 } catch (err) {
 res.status(500).json({
 success: false,
 message: err.message
 });
 }
};

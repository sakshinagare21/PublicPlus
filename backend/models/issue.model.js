import mongoose from "mongoose";

const issueSchema = new mongoose.Schema(
 {
 /* ===============================
 BASIC INFO
 =============================== */
 title: {
 type: String,
 required: true,
 },

 category: {
 type: mongoose.Schema.Types.ObjectId,
 ref: "IssueType"
},

 status: {
 type: String,
 enum: ["reported", "assigned", "in_progress", "resolved", "rejected", "pending_verification", "reopened", "escalated", "closed"],
 default: "reported",
 },

 /* ===============================
 DESCRIPTION (VOICE + TEXT)
 =============================== */
 description: {
 text: {
 type: String,
 required: true,
 },

 audioUrl: String,

 source: {
 type: String,
 enum: ["web_speech", "whisper"],
 default: "web_speech",
 },
 },

 /* ===============================
 IMAGE (FOR VALIDATION)
 =============================== */
 images: [
 {
 url: String,
 hash: String,
 },
 ],

 /* ===============================
 LOCATION DATA
 =============================== */
 location: {
 type: {
 type: String,
 enum: ["Point"],
 default: "Point",
 },
 coordinates: {
 type: [Number], // [lng, lat]
 required: true,
 },
 },

 fullAddress: String,
 locality: String,

 zone: {
 type: String, // IMPORTANT (replaced ward)
 required: true,
 },

 /* ===============================
 TRAFFIC CONTEXT
 =============================== */
 traffic: {
 level: {
 type: String,
 enum: ["low", "medium", "high", "unknown"],
 default: "unknown",
 },
 ratio: Number,
 },

 /* ===============================
 PRIORITY SYSTEM
 =============================== */
 priority: {
 score: {
 type: Number,
 default: 0,
 },

 level: {
 type: String,
 enum: ["low", "medium", "high", "critical"],
 default: "low",
 },

 factors: {
 issueTypeWeight: Number,
 descriptionWeight: Number,
 trafficWeight: Number,
 upvoteWeight: Number,
 },

 calculatedAt: Date,
 },

 /* ===============================
 USER ENGAGEMENT
 =============================== */
 engagement: {
 upvotes: {
 type: Number,
 default: 0,
 },

 downvotes: {
 type: Number,
 default: 0,
 },

 voters: [
 {
 user: {
 type: mongoose.Schema.Types.ObjectId,
 ref: "User",
 },
 vote: {
 type: String,
 enum: ["upvote", "downvote"],
 },
 },
 ],
 },

 /* ===============================
 REPORTER
 =============================== */
 reportedBy: {
 type: mongoose.Schema.Types.ObjectId,
 ref: "User",
 required: true,
 },

 reporterSnapshot: {
 name: String,
 trustScore: Number,
 },

 /* ===============================
 ASSIGNMENT SYSTEM
 =============================== */
 assignedDepartment: {
 type: mongoose.Schema.Types.ObjectId,
 ref: "Department",
 },

 assignedTo: {
 type: mongoose.Schema.Types.ObjectId,
 ref: "Operator", // or "Operator" if separate model
 },

 assignmentStatus: {
 type: String,
 enum: ["pending", "assigned", "in_progress", "completed"],
 default: "pending",
 },

 /* ===============================
 SLA TRACKING
 =============================== */
 sla: {
 responseDeadline: Date,
 resolutionDeadline: Date,

 escalationLevel: {
 type: Number,
 default: 1,
 },

 escalationHistory: [
 {
 level: Number,
 escalatedAt: Date,
 nextDeadline: Date,
 },
 ],

 respondedAt: Date,
 resolvedAt: Date,

 isBreached: {
 type: Boolean,
 default: false,
 },
 },

 /* ===============================
 RESOLUTION
 =============================== */
 resolution: {
 resolvedBy: {
 type: mongoose.Schema.Types.ObjectId,
 ref: "Operator",
 },

 notes: String,

 afterImages: [String],

 proof: {
 url: String,
 uploadedAt: {
 type: Date,
 default: Date.now,
 },
 verified: {
 type: Boolean,
 default: false,
 },
 },

 qualityScore: Number,

 escalation: {
 reason: String,
 proof: String,
 escalatedAt: Date
 }
 },

 /* ===============================
 VERIFICATION
 =============================== */
 verification: {
 status: {
 type: String,
 enum: ["pending", "verified", "rejected"],
 default: "pending",
 },

 verifiedBy: [
 {
 user: {
 type: mongoose.Schema.Types.ObjectId,
 ref: "User",
 },
 action: {
 type: String,
 enum: ["confirm", "reject"],
 },
 createdAt: Date,
 },
 ],

 aiScore: Number,
 },

 /* ===============================
 SYSTEM FLAGS (FRAUD)
 =============================== */
 flags: {
 isDuplicate: {
 type: Boolean,
 default: false,
 },
 isSpam: {
 type: Boolean,
 default: false,
 },
 fraudScore: {
 type: Number,
 default: 0,
 },
 },

 /* ===============================
 ANALYTICS & HISTORY
 =============================== */
 metrics: {
 views: {
 type: Number,
 default: 0,
 },
 },

 statusHistory: [
 {
 status: String,
 remark: String,
 updatedAt: {
 type: Date,
 default: Date.now,
 },
 },
 ],
 },
 {
 timestamps: true,
 },
);

/* ===============================
 INDEXES
=============================== */

issueSchema.index({ location: "2dsphere" });
issueSchema.index({ category: 1 });
issueSchema.index({ zone: 1 });
issueSchema.index({ "priority.score": -1 });

/* ===============================
 EXPORT
=============================== */

const Issue = mongoose.model("Issue", issueSchema);

export default Issue;


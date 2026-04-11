import Issue from "../models/issue.model.js";
import Notification from "../models/notification.model.js";
import Operator from "../models/operator.model.js";
import Department from "../models/department.model.js";
import IssueType from "../models/issueType.model.js";
import SLA from "../models/sla.model.js";
import { detectZone } from "../services/zone.service.js";
import { getTrafficLevel } from "../services/traffic.service.js";
import { calculatePriority } from "../services/priority.service.js";
import { validateImage } from "../services/image.service.js";
import { uploadToCloudinary } from "../utils/cloudinaryStorage.js";
import { assignIssue } from "../services/assignissue.service.js";
import {
    sendVerificationEmail,
    sendReopenedEmail,
    sendIssueResolvedEmail,
    sendIssueClosedEmail,
    sendIssueReportedEmailToCitizen
} from "../utils/email.js";

export const createIssue = async (req, res) => {
    try {
        const { title, category, descriptionText, lat, lng } = req.body;

        if (!title || !category || lat === undefined || lng === undefined) {
            return res.status(400).json({
                message: "Title, category, lat and lng are required",
            });
        }

        const parsedLat = Number(lat);
        const parsedLng = Number(lng);

        if (isNaN(parsedLat) || isNaN(parsedLng)) {
            return res.status(400).json({
                message: "Invalid latitude or longitude",
            });
        }

        /* ================= GET CATEGORY NAME ================= */
        const categoryDoc = await IssueType.findById(category);

        if (!categoryDoc) {
            return res.status(400).json({
                message: "Invalid category",
            });
        }

        /* ================= IMAGE ================= */
        console.log("Evidence Batch Log - Files found:", req.files?.length || 0);
        let imageDataList = [];
        if (req.files && req.files.length > 0) {
            imageDataList = await Promise.all(req.files.map(async (f) => await validateImage(f)));
        }
        // Remove any validation failures
        imageDataList = imageDataList.filter(item => item && item.url);

        /* ================= ZONE ================= */
        const zone = await detectZone(parsedLat, parsedLng);

        /* ================= TRAFFIC ================= */
        let traffic = { level: "unknown", ratio: 0 };

        try {
            traffic = await getTrafficLevel(parsedLat, parsedLng);
        } catch (err) { }

        /* ================= PRIORITY ================= */
        const priority = calculatePriority({
            category: categoryDoc.name, // 🔥 FIX
            description: descriptionText || "",
            traffic,
            upvotes: 0,
        });

        /* ================= SLA ================= */
        const slaConfig = await SLA.findOne({ priority: priority.level });

        let deadline = new Date();
        let level = 1;

        if (slaConfig && slaConfig.levels.length > 0) {
            const firstLevel = slaConfig.levels[0];

            if (firstLevel.unit === "minutes") {
                deadline.setMinutes(deadline.getMinutes() + firstLevel.value);
            } else if (firstLevel.unit === "hours") {
                deadline.setHours(deadline.getHours() + firstLevel.value);
            } else if (firstLevel.unit === "days") {
                deadline.setDate(deadline.getDate() + firstLevel.value);
            }

            level = firstLevel.level;
        } else {
            deadline.setHours(deadline.getHours() + 24);
        }
        /* ================= DUPLICATE DETECTION ================= */
        const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

        // 1. Fetch potential candidates (same category + nearby location + last 24h)
        const potentialDuplicates = await Issue.find({
            category: category,
            createdAt: { $gte: oneDayAgo },
            location: {
                $near: {
                    $geometry: {
                        type: "Point",
                        coordinates: [parsedLng, parsedLat],
                    },
                    $maxDistance: 50,
                },
            },
            status: { $in: ["reported", "assigned", "in_progress", "reopened", "escalated", "resolved", "closed"] }
        });

        // 2. Helper to check 90% word similarity
        const is90PercentMatch = (s1, s2) => {
            const normalize = (s) => s.toLowerCase().replace(/[^\w\s]/g, "").split(/\s+/).filter(w => w.length > 2);
            const w1 = normalize(s1);
            const w2 = normalize(s2);
            if (w1.length === 0 || w2.length === 0) return false;
            const set2 = new Set(w2);
            const intersection = w1.filter(word => set2.has(word));
            return (intersection.length / Math.max(w1.length, w2.length)) >= 0.9;
        };

        const duplicateIssue = potentialDuplicates.find(issue =>
            is90PercentMatch(issue.description.text, descriptionText || "")
        );

        if (duplicateIssue) {
            return res.status(409).json({
                success: false,
                message: duplicateIssue.status === "resolved" || duplicateIssue.status === "closed"
                    ? "This issue was recently marked as resolved. If the problem persists, please wait 24 hours."
                    : "A very similar report already exists nearby. Please upvote the existing issue to speed up resolution.",
                duplicateFound: true,
                existingIssue: {
                    _id: duplicateIssue._id,
                    title: duplicateIssue.title,
                    status: duplicateIssue.status
                }
            });
        }

        /* ================= CREATE ISSUE ================= */
        const issue = await Issue.create({
            title,
            category, // ObjectId stored
            description: {
                text: descriptionText || "",
                source: "web_speech",
            },
            images: imageDataList,
            location: {
                type: "Point",
                coordinates: [parsedLng, parsedLat],
            },
            zone,
            traffic,
            priority,
            sla: {
                resolutionDeadline: deadline,
                escalationLevel: level,
                escalationHistory: [],
            },
            reportedBy: req.user._id,
            statusHistory: [{
                status: "reported",
                remark: "Issue reported by citizen via PublicPlus portal.",
                updatedAt: new Date()
            }]
        });

        /* ================= ASSIGN ================= */
        await assignIssue(issue);

        // 🔥 Send automated confirmation to citizen
        if (req.user?.email) {
            sendIssueReportedEmailToCitizen(req.user.email, issue).catch(err =>
                console.log(`❌ Citizen Confirmation Email failed for ${req.user.email}:`, err.message)
            );
        }

        res.status(201).json({
            message: "Issue created successfully",
            issue,
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
/*=====citizen get all issues controller=====*/
export const getMyIssues = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;

        const issues = await Issue.find({
            reportedBy: req.user._id,
        })
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(Number(limit));

        const total = await Issue.countDocuments({
            reportedBy: req.user._id,
        });

        res.status(200).json({
            total,
            page: Number(page),
            issues,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/* ===== CITIZEN: GET DASHBOARD STATS ===== */
export const getCitizenStats = async (req, res) => {
    try {
        const userId = req.user._id;

        const total = await Issue.countDocuments({ reportedBy: userId });
        const active = await Issue.countDocuments({
            reportedBy: userId,
            status: { $in: ["reported", "assigned", "in_progress", "pending_verification", "reopened"] }
        });
        const resolved = await Issue.countDocuments({ reportedBy: userId, status: "resolved" });

        res.json({
            success: true,
            stats: {
                total,
                active,
                resolved
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/* ===== GLOBAL: GET ALL PUBLIC ISSUES ===== */
export const getAllPublicIssues = async (req, res) => {
    try {
        const { page = 1, limit = 20, search = "" } = req.query;
        const filter = {};

        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: "i" } },
                { "description.text": { $regex: search, $options: "i" } }
            ];
        }

        const issues = await Issue.find(filter)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(Number(limit))
            .populate("reportedBy", "fullName")
            .populate("category", "label name");

        const userVoterId = req.user ? req.user._id.toString() : null;
        const issuesWithVotes = issues.map((issue) => {
            const issueObj = issue.toObject();
            const userVoteDoc = issue.engagement.voters.find(v => v.user.toString() === userVoterId);
            issueObj.userVote = userVoteDoc ? userVoteDoc.vote : null;
            // To keep payload small and secure, remove voters list
            delete issueObj.engagement.voters;
            return issueObj;
        });

        const total = await Issue.countDocuments(filter);

        res.json({
            success: true,
            total,
            issues: issuesWithVotes
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/* ===== GLOBAL: UPVOTE/DOWNVOTE ===== */
export const upvoteIssue = async (req, res) => {
    try {
        const issue = await Issue.findById(req.params.id);
        if (!issue) return res.status(404).json({ message: "Issue not found" });

        const voterId = req.user._id;
        const existingVote = issue.engagement.voters.find(v => v.user.toString() === voterId.toString());

        if (existingVote) {
            if (existingVote.vote === "upvote") {
                // Remove upvote
                issue.engagement.upvotes -= 1;
                issue.engagement.voters = issue.engagement.voters.filter(v => v.user.toString() !== voterId.toString());
            } else {
                // Change downvote to upvote
                issue.engagement.downvotes -= 1;
                issue.engagement.upvotes += 1;
                existingVote.vote = "upvote";
            }
        } else {
            // New upvote
            issue.engagement.upvotes += 1;
            issue.engagement.voters.push({ user: voterId, vote: "upvote" });
        }

        await issue.save();
        const newUserVote = issue.engagement.voters.find(v => v.user.toString() === voterId.toString())?.vote || null;
        res.json({ success: true, upvotes: issue.engagement.upvotes, downvotes: issue.engagement.downvotes, userVote: newUserVote });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const downvoteIssue = async (req, res) => {
    try {
        const issue = await Issue.findById(req.params.id);
        if (!issue) return res.status(404).json({ message: "Issue not found" });

        const voterId = req.user._id;
        const existingVote = issue.engagement.voters.find(v => v.user.toString() === voterId.toString());

        if (existingVote) {
            if (existingVote.vote === "downvote") {
                // Remove downvote
                issue.engagement.downvotes -= 1;
                issue.engagement.voters = issue.engagement.voters.filter(v => v.user.toString() !== voterId.toString());
            } else {
                // Change upvote to downvote
                issue.engagement.upvotes -= 1;
                issue.engagement.downvotes += 1;
                existingVote.vote = "downvote";
            }
        } else {
            // New downvote
            issue.engagement.downvotes += 1;
            issue.engagement.voters.push({ user: voterId, vote: "downvote" });
        }

        await issue.save();
        const newUserVote = issue.engagement.voters.find(v => v.user.toString() === voterId.toString())?.vote || null;
        res.json({ success: true, upvotes: issue.engagement.upvotes, downvotes: issue.engagement.downvotes, userVote: newUserVote });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/*=====get issue by id controller=====*/
export const getIssueById = async (req, res) => {
    try {
        const issue = await Issue.findById(req.params.issueId)
            .populate("reportedBy", "fullName email")
            .populate("assignedDepartment", "departmentName")
            .populate("assignedTo", "fullName email")
            .populate("category", "name label");

        if (!issue) {
            return res.status(404).json({ message: "Issue not found" });
        }

        res.status(200).json(issue);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/*======Department view
all issues assigned to them controller=====*/
export const getDepartmentIssues = async (req, res) => {
    try {
        const { status, priority, zone, page = 1, limit = 10 } = req.query;

        const pageNum = Number(page);
        const limitNum = Number(limit);

        /* ================= FILTER ================= */
        let filter = {
            assignedDepartment: req.department._id,
        };

        if (status) filter.status = status;
        if (priority) filter["priority.level"] = priority;
        if (zone) filter.zone = zone;

        /* ================= QUERY ================= */
        const issues = await Issue.find(filter)
            .sort({ "priority.score": -1 })
            .skip((pageNum - 1) * limitNum)
            .limit(limitNum)
            .populate("reportedBy", "fullName")
            .populate("assignedTo", "fullName");

        const total = await Issue.countDocuments(filter);

        /* ================= UNIQUE ZONES ================= */
        const zones = await Issue.distinct("zone", {
            assignedDepartment: req.department._id,
        });

        res.status(200).json({
            total,
            page: pageNum,
            issues,
            zones, // ✅ send zones for dropdown
        });
    } catch (error) {
        console.error("Department Issues Error:", error);
        res.status(500).json({ message: error.message });
    }
};
/*======get department statistics controller=====*/
export const getDepartmentStats = async (req, res) => {
    try {
        const departmentId = req.department._id;

        const total = await Issue.countDocuments({
            assignedDepartment: departmentId,
        });

        const pending = await Issue.countDocuments({
            assignedDepartment: departmentId,
            status: { $in: ["reported", "assigned", "pending_verification"] },
        });

        const inProgress = await Issue.countDocuments({
            assignedDepartment: departmentId,
            status: { $in: ["in_progress", "reopened", "escalated"] },
        });

        const resolved = await Issue.countDocuments({
            assignedDepartment: departmentId,
            status: { $in: ["resolved", "closed"] },
        });

        res.json({
            total,
            pending,
            inProgress,
            resolved,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/*get operator issue*/
export const getOperatorIssues = async (req, res) => {
    try {
        const issues = await Issue.find({
            assignedTo: req.operator._id,
        })
            .populate("assignedDepartment", "departmentName")
            .populate("category", "name label")
            .sort({ createdAt: -1 });

        res.status(200).json(issues);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
/*issue statistics for operator*/
export const getOperatorStats = async (req, res) => {
    try {
        const operatorId = req.operator._id;

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
            status: { $in: ["resolved", "closed"] },
        });

        const overdue = await Issue.countDocuments({
            assignedTo: operatorId,
            "sla.isBreached": true,
        });

        res.json({
            total,
            pending,
            inProgress,
            completed,
            overdue,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


/*======get issue for admin*/
export const getAllIssuesAdmin = async (req, res) => {
    try {
        const { page = 1, limit = 50, search = "" } = req.query;

        const filter = {};

        // 🔍 SEARCH (title + category)
        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: "i" } },
                { "description.text": { $regex: search, $options: "i" } }
            ];
        }

        const issues = await Issue.find(filter)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(Number(limit))
            .populate("assignedDepartment", "departmentName")
            .populate("assignedTo", "fullName");

        const total = await Issue.countDocuments(filter);

        res.json({
            success: true,
            total,
            issues
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

/*show admin statistics*/
export const getAdminStats = async (req, res) => {
    try {
        // 1. Overall Counts
        const total = await Issue.countDocuments();
        const critical = await Issue.countDocuments({ "priority.level": "critical" });
        const high = await Issue.countDocuments({ "priority.level": "high" });
        const medium = await Issue.countDocuments({ "priority.level": "medium" });
        const low = await Issue.countDocuments({ "priority.level": "low" });
        const pending = await Issue.countDocuments({ status: "reported" });
        const inProgress = await Issue.countDocuments({ status: "in_progress" });
        const resolved = await Issue.countDocuments({ status: "resolved" });

        // 2. Department Workloads
        const allDepartments = await Department.find({ status: "Approved" });
        const departmentStats = await Promise.all(
            allDepartments.map(async (dept) => {
                const totalDept = await Issue.countDocuments({ assignedDepartment: dept._id });
                const activeDept = await Issue.countDocuments({
                    assignedDepartment: dept._id,
                    status: { $in: ["reported", "assigned", "in_progress", "reopened", "escalated"] }
                });

                // Calculate load (percentage of active vs total issues)
                const load = totalDept > 0 ? Math.round((activeDept / totalDept) * 100) : 0;

                // Determine color based on load
                let color = "bg-green-500";
                if (load > 70) color = "bg-red-500";
                else if (load > 40) color = "bg-blue-500";

                return {
                    name: dept.departmentName.toUpperCase(),
                    load,
                    color,
                    activeCount: activeDept,
                    totalCount: totalDept
                };
            })
        );

        // 3. Activity Logs (fetching recent status updates from all issues)
        const recentIssues = await Issue.find()
            .sort({ updatedAt: -1 })
            .limit(10)
            .populate("assignedDepartment", "departmentName")
            .select("title status statusHistory updatedAt");

        const logs = [];
        recentIssues.forEach(issue => {
            if (issue.statusHistory && issue.statusHistory.length > 0) {
                const lastUpdate = issue.statusHistory[issue.statusHistory.length - 1];
                logs.push({
                    time: new Date(lastUpdate.updatedAt).toLocaleTimeString(),
                    tag: lastUpdate.status.toUpperCase(),
                    msg: `${issue.title}: ${lastUpdate.remark || "Status updated."}`,
                    timestamp: lastUpdate.updatedAt
                });
            }
        });

        // Sort logs by newest first
        const sortedLogs = logs.sort((a, b) => b.timestamp - a.timestamp).slice(0, 6);

        res.json({
            success: true,
            stats: {
                total,
                critical,
                high,
                medium,
                low,
                pending,
                inProgress,
                resolved
            },
            departments: departmentStats,
            logs: sortedLogs
        });

    } catch (err) {
        console.error("Admin Stats Error:", err);
        res.status(500).json({ message: err.message });
    }
};
/*assign issue to department controller=====*/
export const assignDepartment = async (req, res) => {
    try {
        const { departmentId, priority, slaDeadline } = req.body;

        const issue = await Issue.findById(req.params.issueId);

        if (!issue) {
            return res.status(404).json({ message: "Issue not found" });
        }

        issue.assignedDepartment = departmentId;
        issue.priority = priority || issue.priority;
        issue.slaDeadline = slaDeadline;
        issue.status = "assigned";

        if (!issue.statusHistory) issue.statusHistory = [];
        issue.statusHistory.push({
            status: "assigned",
            remark: "Admin assigned the mission to a specific department.",
            updatedAt: new Date()
        });

        await issue.save();

        res.status(200).json({ message: "Department assigned successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/*=====Department update issue status controller=====*/
export const updateIssueStatus = async (req, res) => {
    try {
        const { status, remark } = req.body; // status can be 'closed' (approved) or 'in_progress' (rejected)

        const issue = await Issue.findById(req.params.issueId);

        if (!issue) {
            return res.status(404).json({ message: "Issue not found" });
        }

        if (
            issue.assignedDepartment?.toString() !== req.department._id.toString()
        ) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        const oldStatus = issue.status;
        issue.status = status;

        if (status === "resolved") {
            issue.resolvedAt = new Date();
        }

        if (oldStatus === "escalated") {
            if (status === "closed") {
                // Approved escalation -> close task
                if (!issue.statusHistory) issue.statusHistory = [];
                issue.statusHistory.push({
                    status: "closed",
                    remark: `Escalation approved by Department Admin. ${remark || ""}`,
                    updatedAt: new Date()
                });

                // Notify Operator
                await Notification.create({
                    title: "Escalation Approved",
                    message: `Your escalation for "${issue.title}" was approved. Mission closed.`,
                    type: "issue_resolved",
                    targetRole: "operator",
                    operatorId: issue.assignedTo,
                    issueId: issue._id,
                    createdBy: req.department._id,
                    createdByModel: "Department"
                });
            } else {
                // Rejected escalation -> set back to active
                if (!issue.statusHistory) issue.statusHistory = [];
                issue.statusHistory.push({
                    status: status,
                    remark: `Escalation rejected by Department Admin. ${remark || ""}`,
                    updatedAt: new Date()
                });

                // Notify Operator
                await Notification.create({
                    title: "Escalation Rejected",
                    message: `Department Admin rejected your escalation for "${issue.title}". Continue working.`,
                    type: "issue_reopened",
                    targetRole: "operator",
                    operatorId: issue.assignedTo,
                    issueId: issue._id,
                    createdBy: req.department._id,
                    createdByModel: "Department"
                });
            }
        }

        await issue.save();

        res.status(200).json({ message: `Issue status updated to ${status}`, issue });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/*=====delete issue only if pending and owner controller=====*/
export const deleteIssue = async (req, res) => {
    try {
        const issue = await Issue.findById(req.params.issueId);

        if (!issue) {
            return res.status(404).json({ message: "Issue not found" });
        }

        if (
            issue.reportedBy.toString() !== req.user._id.toString() ||
            issue.status !== "pending"
        ) {
            return res.status(403).json({ message: "Cannot delete this issue" });
        }

        await issue.deleteOne();

        res.status(200).json({ message: "Issue deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/* ======================================================== */
/* ADVANCED WORKFLOW APIs */
/* ======================================================== */

/* ===== COMMON: GET TIMER ===== */
export const getTimer = async (req, res) => {
    try {
        const issue = await Issue.findById(req.params.id);
        if (!issue) return res.status(404).json({ message: "Issue not found" });

        if (!issue.sla || !issue.sla.resolutionDeadline) {
            return res.status(400).json({ message: "SLA Deadline not set for this issue" });
        }

        const now = new Date();
        const deadline = new Date(issue.sla.resolutionDeadline);
        const msRemaining = deadline - now;

        // SLA Stops if issue is pending_verification, resolved, closed, or escalated
        const isStopped = ["pending_verification", "resolved", "closed", "escalated"].includes(issue.status);

        res.status(200).json({
            deadline: issue.sla.resolutionDeadline,
            msRemaining: (isStopped || msRemaining < 0) ? 0 : msRemaining,
            isExpired: !isStopped && msRemaining <= 0,
            isStopped: isStopped
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



/* ===== OPERATOR: UPLOAD PROOF ===== */
export const uploadProof = async (req, res) => {
    try {
        const issue = await Issue.findById(req.params.id).populate("reportedBy", "email");
        if (!issue) return res.status(404).json({ message: "Issue not found" });

        if (issue.assignedTo?.toString() !== req.operator._id.toString()) {
            return res.status(403).json({ message: "Unauthorized to upload proof for this issue" });
        }

        const operatorZone = (req.operator.assignedZone?.zoneName || "").trim().toLowerCase();
        const issueZone = (issue.zone || "").trim().toLowerCase();

        if (operatorZone && issueZone && operatorZone !== issueZone) {
            return res.status(403).json({
                message: `Zone mismatch. Your zone is "${req.operator.assignedZone?.zoneName}" but this issue is in "${issue.zone}".`
            });
        }

        let proofUrl = "";
        if (req.file) {
            proofUrl = await uploadToCloudinary(req.file, "proofs");
        } else if (req.body.proofUrl) {
            proofUrl = req.body.proofUrl;
        } else {
            return res.status(400).json({ message: "Proof image is required." });
        }

        // Safely initialize resolution if it doesn't exist yet
        if (!issue.resolution) issue.resolution = {};

        issue.resolution.proof = {
            url: proofUrl,
            uploadedAt: new Date(),
            verified: false
        };

        // Status changes to closed if operator marks as non-existent, else pending_verification
        if (req.body.isInvalid === "true" || req.body.isInvalid === true) {
            issue.status = "closed";
        } else {
            issue.status = "pending_verification";
        }

        // 🔥 TRACK HISTORY
        if (!issue.statusHistory) issue.statusHistory = [];
        issue.statusHistory.push({
            status: issue.status,
            remark: req.body.isInvalid ? "Marked as invalid by operator with proof." : "Work completed. Proof uploaded for verification.",
            updatedAt: new Date()
        });

        await issue.save();

        // Send email/notification to citizen
        if (issue.status === "pending_verification" && issue.reportedBy && issue.reportedBy.email) {
            await sendVerificationEmail(
                issue.reportedBy.email,
                issue.title,
                req.operator.fullName,
                proofUrl,
                issue._id
            );
        } else if (issue.status === "closed" && issue.reportedBy && issue.reportedBy.email) {
            await sendIssueClosedEmail(
                issue.reportedBy.email,
                issue.title,
                req.operator.fullName,
                req.body.notes || "Marked as invalid issue."
            );
        }

        // Create DB Notification for Citizen
        if (issue.reportedBy?._id) {
            if (issue.status === "closed") {
                await Notification.create({
                    title: "Issue Closed",
                    message: `Operator has closed "${issue.title}" as it was reported as non-existent or incorrect with proof.`,
                    type: "issue_resolved",
                    targetRole: "user",
                    userId: issue.reportedBy._id,
                    issueId: issue._id,
                    createdByModel: "Operator",
                    createdBy: req.operator._id
                });

                // Inform Department Admin too
                if (issue.assignedDepartment) {
                    const department = await Department.findById(issue.assignedDepartment);
                    if (department && department.email) {
                        // Email to Dept Admin
                        sendEmail({
                            to: department.email,
                            subject: `Task Closed: ${issue.title} (Invalid/Wrong Issue)`,
                            html: `<div style="padding:20px; font-family:sans-serif;">
 <h2>Task Closed by Operator</h2>
 <p>Mission: <b>${issue.title}</b></p>
 <p>Operator: <b>${req.operator.fullName}</b></p>
 <p>Reason: marked as non-existent/incorrect report.</p>
 <p>Operator Remark: ${req.body.notes || "No additional comments"}</p>
 </div>`
                        }).catch(e => console.log("Dept Close Notify Fail:", e.message));

                        // Notification to Dept Admin
                        await Notification.create({
                            title: "Task Invalidated",
                            message: `Operator ${req.operator.fullName} closed "${issue.title}" as non-existent.`,
                            type: "issue_resolved",
                            targetRole: "department",
                            departmentId: department._id,
                            issueId: issue._id,
                            createdByModel: "Operator",
                            createdBy: req.operator._id
                        });
                    }
                }
            } else {
                await Notification.create({
                    title: "Verification Required",
                    message: `Operator has submitted proof for "${issue.title}". Please verify.`,
                    type: "verification_required",
                    targetRole: "user",
                    userId: issue.reportedBy._id,
                    issueId: issue._id,
                    createdByModel: "Operator",
                    createdBy: req.operator._id
                });
            }
        }

        const successMessage = issue.status === "closed" ? "Task closed as non-existent" : "Proof uploaded, waiting for verification";
        res.status(200).json({ message: successMessage, issue });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/* ===== CITIZEN: VERIFY AND RATE ===== */

export const verifyIssue = async (req, res) => {
    try {
        const { rating } = req.body;
        const issue = await Issue.findById(req.params.id);

        if (!issue) return res.status(404).json({ message: "Issue not found" });

        if (issue.reportedBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Only the reporter can verify this issue" });
        }

        if (issue.status !== "pending_verification") {
            return res.status(400).json({ message: "Issue is not pending verification." });
        }

        issue.status = "resolved";
        if (!issue.resolution) issue.resolution = {};
        if (issue.resolution.proof) issue.resolution.proof.verified = true;

        // Store citizen's verification image if uploaded
        if (req.file) {
            issue.resolution.citizenVerificationImage = await uploadToCloudinary(req.file, "verifications");
        }

        if (!issue.sla) issue.sla = {};
        issue.sla.resolvedAt = new Date();

        if (rating) {
            issue.rating = Number(rating);
        }

        await issue.save();

        // Update Operator Ratings
        if (issue.assignedTo && rating) {
            const operator = await Operator.findById(issue.assignedTo);
            if (operator) {
                operator.totalRatings += 1;
                operator.ratingAverage = ((operator.ratingAverage * (operator.totalRatings - 1)) + Number(rating)) / operator.totalRatings;
                operator.trustScore = Math.min(operator.trustScore + 2, 100);

                if (operator.currentActiveTasks && operator.currentActiveTasks > 0) {
                    operator.currentActiveTasks -= 1;
                }
                operator.totalTasksCompleted += 1;

                await operator.save();

                if (operator.email) {
                    await sendIssueResolvedEmail(operator.email, issue.title, rating);
                }
            }
        }

        // Create DB Notification for Operator & Department
        await Notification.create({
            title: "Resolution Verified",
            message: `Issue "${issue.title}" has been verified and fully resolved.`,
            type: "issue_resolved",
            targetRole: "operator",
            operatorId: issue.assignedTo,
            issueId: issue._id,
            departmentId: issue.assignedDepartment,
            createdByModel: "User",
            createdBy: req.user._id
        });

        // Notify Citizen
        await Notification.create({
            title: "Issue Resolved",
            message: `Great news! Your issue "${issue.title}" has been verified and resolved.`,
            type: "issue_resolved",
            targetRole: "user",
            userId: issue.reportedBy,
            issueId: issue._id,
            createdByModel: "User",
            createdBy: req.user._id
        });

        res.status(200).json({ message: "Issue verified and resolved successfully", issue });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/* ===== CITIZEN: REOPEN ISSUE ===== */
export const reopenIssue = async (req, res) => {
    try {
        const issue = await Issue.findById(req.params.id);
        if (!issue) return res.status(404).json({ message: "Issue not found" });

        if (issue.reportedBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Only reporter can reopen." });
        }

        issue.status = "reopened";

        // Safety check if resolution.proof exists
        if (issue.resolution && issue.resolution.proof) {
            issue.resolution.proof.verified = false;
        }

        // Save citizen's rejection proof
        let citizenProofUrl = "";
        if (req.files && req.files.length > 0) {
            citizenProofUrl = `/uploads/${req.file.filename}`;
            if (!issue.resolution) issue.resolution = {};
            issue.resolution.rejectionProof = citizenProofUrl;
        }

        // ==== RESTART TIMER ====
        const slaConfig = await SLA.findOne({ priority: issue.priority?.level || "low" });
        let newDeadline = new Date();

        if (slaConfig && slaConfig.levels && slaConfig.levels.length > 0) {
            const firstLevel = slaConfig.levels[0];
            if (firstLevel.unit === "minutes") newDeadline.setMinutes(newDeadline.getMinutes() + firstLevel.value);
            else if (firstLevel.unit === "hours") newDeadline.setHours(newDeadline.getHours() + firstLevel.value);
            else if (firstLevel.unit === "days") newDeadline.setDate(newDeadline.getDate() + firstLevel.value);
        } else {
            newDeadline.setHours(newDeadline.getHours() + 24);
        }

        if (!issue.sla) issue.sla = {};
        issue.sla.resolutionDeadline = newDeadline;
        issue.sla.isBreached = false;

        await issue.save();

        if (issue.assignedTo) {
            const operator = await Operator.findById(issue.assignedTo);
            if (operator) {
                operator.trustScore = Math.max(operator.trustScore - 5, 0);
                await operator.save();

                if (operator.email) {
                    await sendReopenedEmail(operator.email, issue.title, citizenProofUrl);
                }
            }
        }

        // Notify Operator
        await Notification.create({
            title: "Issue Reopened",
            message: `User rejected the resolution proof for "${issue.title}". Action required.`,
            type: "issue_reopened",
            targetRole: "operator",
            operatorId: issue.assignedTo,
            departmentId: issue.assignedDepartment,
            issueId: issue._id,
            createdByModel: "User",
            createdBy: req.user._id
        });

        // Notify Department
        await Notification.create({
            title: "Issue Reopened",
            message: `Citizen rejected resolution for "${issue.title}".`,
            type: "issue_reopened",
            targetRole: "department",
            departmentId: issue.assignedDepartment,
            issueId: issue._id,
            createdByModel: "User",
            createdBy: req.user._id
        });

        // Notify Admin
        await Notification.create({
            title: "Issue Reopened",
            message: `Issue "${issue.title}" was reopened by citizen. Zone: ${issue.zone}`,
            type: "issue_reopened",
            targetRole: "admin",
            issueId: issue._id,
            createdByModel: "User",
            createdBy: req.user._id
        });

        res.status(200).json({ message: "Issue has been reopened and operator penalized." });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/* escalate issue controller (Operator -> Admin) */
export const escalateIssue = async (req, res) => {
    try {
        const { id } = req.params;
        const { reason } = req.body;

        const issue = await Issue.findById(id).populate("assignedDepartment");
        if (!issue) {
            return res.status(404).json({ message: "Issue not found" });
        }

        let proofUrl = "";
        if (req.file) {
            proofUrl = `/uploads/proofs/${req.file.filename}`;
        }

        issue.status = "escalated";
        issue.isEscalated = true;

        if (!issue.resolution) issue.resolution = {};
        issue.resolution.escalation = {
            reason,
            proof: proofUrl,
            escalatedAt: new Date()
        };

        if (!issue.statusHistory) issue.statusHistory = [];
        issue.statusHistory.push({
            status: "escalated",
            remark: `Escalated by Operator: ${reason}`,
            updatedAt: new Date()
        });

        await issue.save();

        // Create Notification for Admin
        await Notification.create({
            title: "Mission Escalated",
            message: `Operator requested intervention for Issue: ${issue.title}. Reason: ${reason}`,
            type: "task_escalated",
            targetRole: "admin",
            operatorId: req.operator._id,
            departmentId: issue.assignedDepartment?._id,
            issueId: issue._id,
            createdBy: req.operator._id,
            createdByModel: "Operator"
        });

        // Create Notification for Department
        if (issue.assignedDepartment?._id) {
            await Notification.create({
                title: "Escalation Requested",
                message: `Operator ${req.operator.fullName} escalated "${issue.title}". Proof: ${proofUrl ? "Uploaded" : "No image"}. Reason: ${reason}`,
                type: "task_escalated",
                targetRole: "department",
                operatorId: req.operator._id,
                departmentId: issue.assignedDepartment._id,
                issueId: issue._id,
                createdBy: req.operator._id,
                createdByModel: "Operator",
                escalation: { reason, proof: proofUrl } // 🔥 Attach escalation payload directly to notification database row
            });
        }

        // Create Notification for Operator (Self Confirm)
        await Notification.create({
            title: "Escalation Sent",
            message: `Mission "${issue.title}" has been escalated for review.`,
            type: "task_escalated",
            targetRole: "operator",
            operatorId: req.operator._id,
            issueId: issue._id,
            createdBy: req.operator._id,
            createdByModel: "Operator"
        });

        res.status(200).json({ message: "Issue escalated to city administration", issue });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/* get nearby issues (Geospatial) */
export const getNearbyIssues = async (req, res) => {
    try {
        const { lat, lng, radius = 5 } = req.query;

        if (!lat || !lng) {
            return res.status(400).json({ message: "Location coordinates (lat, lng) are required" });
        }

        const issues = await Issue.find({
            location: {
                $near: {
                    $geometry: {
                        type: "Point",
                        coordinates: [Number(lng), Number(lat)],
                    },
                    $maxDistance: Number(radius) * 1000, // KM to Meters
                },
            },
        })
            .populate("category", "name label")
            .populate("assignedDepartment", "departmentName")
            .limit(100);

        res.status(200).json({
            success: true,
            count: issues.length,
            issues,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


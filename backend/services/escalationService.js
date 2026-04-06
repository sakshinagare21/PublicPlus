import Issue from "../models/issue.model.js";
import Notification from "../models/notification.model.js";
import Operator from "../models/operator.model.js";

/**
 * Checks for issues that have breached their SLA resolution deadline
 * and triggers escalation notifications.
 */
export const checkAndEscalateIssues = async () => {
    try {
        const now = new Date();

        // 1. Find issues that:
        // - Have an active deadline
        // - Deadline has passed
        // - Are NOT resolved or already escalated
        const breachedIssues = await Issue.find({
            "sla.resolutionDeadline": { $lt: now },
            status: { $nin: ["resolved", "escalated", "closed", "rejected"] },
            "sla.isBreached": false
        }).populate("assignedTo", "fullName email")
          .populate("assignedDepartment", "departmentName");

        if (breachedIssues.length === 0) return;

        console.log(`[SLA] Found ${breachedIssues.length} issues requiring escalation.`);

        for (const issue of breachedIssues) {
            // Update issue status
            issue.status = "escalated";
            issue.sla.isBreached = true;
            issue.sla.escalationLevel = (issue.sla.escalationLevel || 1) + 1;
            
            await issue.save();

            const operatorName = issue.assignedTo?.fullName || "Unassigned";
            const operatorId = issue.assignedTo?._id;
            const deptId = issue.assignedDepartment?._id;

            const escalationMessage = `CRITICAL: Issue #${issue._id} has breached SLA. Assigned Operator: ${operatorName}. Immediate action required.`;

            // 2. Create Notifications for Admin, Dept, and Operator
            const notificationData = [
                // For Admin
                {
                    title: "SLA Breach - Auto Escalation",
                    message: escalationMessage,
                    type: "task_escalated",
                    targetRole: "admin",
                    issueId: issue._id,
                    operatorId: operatorId
                },
                // For Department
                {
                    title: "Escalation Alert",
                    message: escalationMessage,
                    type: "task_escalated",
                    targetRole: "department",
                    departmentId: deptId,
                    issueId: issue._id,
                    operatorId: operatorId
                }
            ];

            // Only notify operator if one is assigned
            if (operatorId) {
                notificationData.push({
                    title: "Urgent: Task Escalated",
                    message: `Your assigned task #${issue._id} has breached the SLA deadline.`,
                    type: "task_escalated",
                    targetRole: "operator",
                    operatorId: operatorId,
                    issueId: issue._id
                });
            }

            await Notification.insertMany(notificationData);
            console.log(`[SLA] Issue ${issue._id} escalated successfully.`);
        }
    } catch (error) {
        console.error("[SLA Error] Escalation check failed:", error);
    }
};

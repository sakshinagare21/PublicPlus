import cron from "node-cron";
import Issue from "../models/issue.model.js";
import SLA from "../models/sla.model.js";
import Notification from "../models/notification.model.js";
import { sendEscalationEmail, sendCriticalEscalationEmail } from "../utils/email.js";

cron.schedule("*/5 * * * *", async () => {

    const now = new Date();

    const issues = await Issue.find({
        status: { $ne: "resolved" },
        "sla.resolutionDeadline": { $lt: now }
    }).populate("assignedDepartment assignedTo");

    for (let issue of issues) {

        const slaConfig = await SLA.findOne({
            priority: issue.priority.level
        });

        const currentLevel = issue.sla.escalationLevel;

        const nextLevel = slaConfig.levels.find(
            l => l.level === currentLevel + 1
        );

        /* 🔥 SEND EMAIL */
        await sendEscalationEmail(
            issue,
            issue.assignedDepartment,
            issue.assignedTo
        );

        /* 🔥 NEXT LEVEL LOGIC */

        if (nextLevel) {

            let newDeadline = new Date();

            if (nextLevel.unit === "minutes") {
                newDeadline.setMinutes(newDeadline.getMinutes() + nextLevel.value);
            } else if (nextLevel.unit === "hours") {
                newDeadline.setHours(newDeadline.getHours() + nextLevel.value);
            } else if (nextLevel.unit === "days") {
                newDeadline.setDate(newDeadline.getDate() + nextLevel.value);
            }

            issue.sla.resolutionDeadline = newDeadline;
            issue.sla.escalationLevel = nextLevel.level;

            issue.sla.escalationHistory.push({
                level: nextLevel.level,
                escalatedAt: new Date(),
                nextDeadline: newDeadline
            });

        } else {
            issue.sla.isBreached = true; // final stage
        }

        /* 🔥 DASHBOARD NOTIFICATIONS */
        const operatorName = issue.assignedTo?.fullName || "Unassigned";
        const opId = issue.assignedTo?._id || "N/A";
        const issueIdStr = issue._id.toString();

        const notifyRoles = [
            {
                targetRole: "admin",
                message: `SLA BREACH: Issue #${issueIdStr} escalated (Level ${issue.sla.escalationLevel}). Operator: ${operatorName} (ID: ${opId}).`
            },
            {
                targetRole: "department",
                departmentId: issue.assignedDepartment?._id,
                message: `ACTION REQUIRED: Issue #${issueIdStr} has breached SLA. Assigned Operator: ${operatorName}.`
            },
            {
                targetRole: "operator",
                operatorId: issue.assignedTo?._id,
                message: `🚨 DEADLINE BREACHED: Issue #${issueIdStr} is now escalated. Your performance score may be impacted.`
            }
        ];

        for (const n of notifyRoles) {
            if (n.targetRole === "admin" || (n.targetRole === "department" && n.departmentId) || (n.targetRole === "operator" && n.operatorId)) {
                await Notification.create({
                    title: "SLA MISSION ESCALATED",
                    message: n.message,
                    type: "task_escalated",
                    targetRole: n.targetRole,
                    departmentId: n.departmentId || null,
                    operatorId: n.operatorId || null,
                    issueId: issue._id,
                    createdByModel: "Admin"
                });
            }
        }

        /* 🛡️ CRITICAL ADMIN ALERT (LEVEL 3+) */
        if (issue.sla.escalationLevel >= 3) {
            await Notification.create({
                title: "🚨 CRITICAL MISSION EMERGENCY",
                message: `DEEP BREACH: Mission "${issue.title}" has breached SLA three times. Immediate direct intervention required by Level 3 oversight.`,
                type: "task_escalated",
                targetRole: "admin",
                issueId: issue._id,
                severity: "high", // if schema supports it
                createdByModel: "Admin"
            });

            // Send critical email specifically to Admin
            await sendCriticalEscalationEmail(issue);
        }

        await issue.save();
    }

});

import Department from "../models/department.model.js";
import Operator from "../models/operator.model.js";
import { sendIssueToAdminEmail } from "../utils/email.js";
import {
  sendIssueAssignedToDepartmentEmail,
  sendIssueAssignedToOperatorEmail
} from "../utils/email.js";

import { sendNotification } from "../utils/notify.js";
export const assignIssue = async (issue) => {

  /* ================= FIND DEPARTMENT ================= */
  const department = await Department.findOne({
    issueTypes: issue.category,
  });

  if (!department) return;

  /* ================= TRY NORMAL ZONE ================= */
  let operators = await Operator.find({
    departmentId: department._id,
    "assignedZone.zoneName": issue.zone,
    status: "active",
    approvalStatus: "approved",
  });

  /* ================= FALLBACK ================= */
  if (!operators.length) {
    console.log("⚠️ No operator in zone → using General Pune Zone");

    operators = await Operator.find({
      departmentId: department._id,
      "assignedZone.zoneName": "General Pune Zone",
      status: "active",
      approvalStatus: "approved",
    });
  }

  /* ================= ENSURE CATEGORY DATA ================= */
  // Populate category to get the name for emails
  await issue.populate("category");

  /* ================= FINAL FALLBACK: ANY OPERATOR IN DEPT ================= */
  if (!operators.length) {
    console.log("📍 Final Fallback → Using any approved operator in department");
    operators = await Operator.find({
      departmentId: department._id,
      status: "active",
      approvalStatus: "approved",
    });
  }

  if (!operators.length) {
    console.log("❌ No operator available in entire department");
    issue.assignedDepartment = department._id;
    await issue.save();

    // Notify of unassigned issue
    if (!issue.statusHistory) issue.statusHistory = [];
    issue.statusHistory.push({
      status: "assigned",
      remark: `System assigned to Department: ${department.departmentName}. Awaiting available operator.`,
      updatedAt: new Date()
    });
    await issue.save();

    sendIssueAssignedToDepartmentEmail(department, issue, null).catch(err => console.log("Email failed:", err.message));
    sendIssueToAdminEmail(issue, department, null).catch(err => console.log("Email failed:", err.message));
    return;
  }

  /* ================= FILTER CAPACITY ================= */
  const available = operators.filter(
    (op) => op.currentActiveTasks < op.maxCapacity
  );

  if (!available.length) {
    // Still assigned to department but pending operator
    issue.assignedDepartment = department._id;
    await issue.save();
    sendIssueAssignedToDepartmentEmail(department, issue, null).catch(err => console.log("Email failed:", err.message));
    sendIssueToAdminEmail(issue, department, null).catch(err => console.log("Email failed:", err.message));
    return;
  }

  /* ================= LEAST LOAD ================= */
  let selected = available[0];
  for (let op of available) {
    if (op.currentActiveTasks < selected.currentActiveTasks) {
      selected = op;
    }
  }

  /* ================= ASSIGN ================= */
  issue.assignedDepartment = department._id;
  issue.assignedTo = selected._id;
  issue.assignmentStatus = "assigned";
  issue.status = "assigned";

  if (!issue.statusHistory) issue.statusHistory = [];
  issue.statusHistory.push({
    status: "assigned",
    remark: `Mission assigned to ${selected.fullName} in ${department.departmentName}.`,
    updatedAt: new Date()
  });

  await issue.save();

  selected.currentActiveTasks += 1;
  selected.totalTasksAssigned += 1;
  await selected.save();

  // 🔥 BACKGROUND EMAIL (Full assignment)
  sendIssueAssignedToDepartmentEmail(department, issue, selected).catch(err => console.log("Email failed:", err.message));
  sendIssueAssignedToOperatorEmail(selected, issue).catch(err => console.log("Email failed:", err.message));
  sendIssueToAdminEmail(issue, department, selected).catch(err => console.log("Email failed:", err.message));

  // 🔥 BACKGROUND NOTIFICATIONS (Non-blocking)
  sendNotification({
    title: "New Issue Assigned",
    message: `${issue.title} assigned to ${selected.fullName}`,
    type: "issue_created",
    targetRole: "department",
    departmentId: department._id,
    operatorId: selected._id,
    issueId: issue._id,
    createdBy: issue.reportedBy,
    createdByModel: "User"
  }).catch(err => console.log("Notification failed:", err.message));

  sendNotification({
    title: "New Task Assigned",
    message: `You received issue: ${issue.title}`,
    type: "issue_created",
    targetRole: "operator",
    operatorId: selected._id,
    issueId: issue._id,
    createdBy: issue.reportedBy,
    createdByModel: "User"
  }).catch(err => console.log("Notification failed:", err.message));
};
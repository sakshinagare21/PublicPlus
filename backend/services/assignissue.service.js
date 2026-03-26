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

  if (!operators.length) {
    console.log("❌ No operator even in General Zone");
    return;
  }

  /* ================= FILTER CAPACITY ================= */
  const available = operators.filter(
    (op) => op.currentActiveTasks < op.maxCapacity
  );

  if (!available.length) return;

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

  await issue.save();

  selected.currentActiveTasks += 1;
  selected.totalTasksAssigned += 1;
  await selected.save();

  console.log("Category:", issue.category);
  console.log("Zone:", issue.zone);

  /* ================= EMAIL ================= */

  try {
    await sendIssueAssignedToDepartmentEmail(department, issue, selected);
    await sendIssueAssignedToOperatorEmail(selected, issue);
     await sendIssueToAdminEmail(issue, department, selected);

  } catch (err) {
    console.log("Email failed:", err.message);
  }

  /* ================= NOTIFICATION ================= */

  try {
    // 🏢 Department
    await sendNotification({
      title: "New Issue Assigned",
      message: `${issue.title} assigned to ${selected.fullName}`,
      type: "issue_created",
      targetRole: "department",
      departmentId: department._id,
      createdBy: issue.reportedBy,
      createdByModel: "User"
    });

    // 👷 Operator
    await sendNotification({
      title: "New Task Assigned",
      message: `You received issue: ${issue.title}`,
      type: "issue_created",
      targetRole: "operator",
      operatorId: selected._id,
      createdBy: issue.reportedBy,
      createdByModel: "User"
    });

  } catch (err) {
    console.log("Notification failed:", err.message);
  }

};
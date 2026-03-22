import Operator from "../models/operator.model.js";
import Department from "../models/department.model.js";
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

  /* ================= FALLBACK TO GENERAL ZONE ================= */
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
  console.log("Category:", issue.category);
  console.log("Zone:", issue.zone);
  console.log("Department:", department);
  console.log("Operators:", operators);
  console.log("Available:", available);
  await selected.save();  
};
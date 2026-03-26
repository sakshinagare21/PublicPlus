import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

import nodemailer from "nodemailer";

/* Create transporter FIRST */

const transporter = nodemailer.createTransport({
service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS
  }
});

console.log("EMAIL:", process.env.EMAIL);
console.log("PASS:", process.env.EMAIL_PASS ? "Loaded" : "Missing");

transporter.verify((error) => {
  if (error) {
    console.log("SMTP ERROR:", error);
  } else {
    console.log("SMTP SERVER READY");
  }
});


/* EMAIL TO ADMIN WHEN DEPARTMENT REGISTERS */

export const sendDepartmentRegistrationEmail = async (department) => {
  await transporter.sendMail({
    from: process.env.EMAIL,
    to: process.env.ADMIN_EMAIL,
    subject: "New Department Registration",
    html: `
      <h2>New Department Request</h2>

      <p><b>Department:</b> ${department.departmentName}</p>
      <p><b>Code:</b> ${department.departmentCode}</p>
      <p><b>Email:</b> ${department.email}</p>

      <p>Please approve in admin dashboard.</p>
    `
  });
};

/* EMAIL WHEN APPROVED */

export const sendDepartmentApprovedEmail = async (department) => {
  await transporter.sendMail({
    from: process.env.EMAIL,
    to: department.email,
    subject: "Department Approved",
    html: `
      <h2>Your Department Has Been Approved</h2>

      <p>Hello ${department.departmentName},</p>

      <p>Your department account has been approved.</p>

      <p>You can now login to the dashboard.</p>
    `
  });
};

/* EMAIL WHEN REJECTED */

export const sendDepartmentRejectedEmail = async (department) => {
  await transporter.sendMail({
    from: process.env.EMAIL,
    to: department.email,
    subject: "Department Registration Rejected",
    html: `
      <h2>Department Registration Rejected</h2>

      <p>Hello ${department.departmentName},</p>

      <p>Your department registration request has been rejected by the administrator.</p>

      <p>Department Code: ${department.departmentCode}</p>
    `
  });
};


/*email to department when operator applies*/
export const sendOperatorRequestEmail = async (operator, departmentEmail) => {

  await transporter.sendMail({
    from: process.env.EMAIL,
    to: departmentEmail,
    subject: "New Operator Registration Request",
    html: `
      <h2>New Operator Application</h2>

      <p><b>Name:</b> ${operator.fullName}</p>
      <p><b>Email:</b> ${operator.email}</p>
      <p><b>Phone:</b> ${operator.phoneNumber}</p>

      <p>Please login to department dashboard to approve or reject.</p>
    `
  });

};


/* ================= EMAIL TO OPERATOR WHEN APPROVED ================= */

export const sendOperatorApprovedEmail = async (operator) => {

  await transporter.sendMail({
    from: process.env.EMAIL,
    to: operator.email,
    subject: "Operator Account Approved",
    html: `
      <h2>Congratulations ${operator.fullName}</h2>

      <p>Your operator account has been approved by the department.</p>
       <p><b>Assigned Zone:</b> ${operator.assignedZone}</p>

      <p>You can now login to the operator dashboard.</p>
    `
  });

};


/* ================= EMAIL WHEN REJECTED ================= */

export const sendOperatorRejectedEmail = async (operator) => {

  await transporter.sendMail({
    from: process.env.EMAIL,
    to: operator.email,
    subject: "Operator Application Rejected",
    html: `
      <h2>Hello ${operator.fullName}</h2>

      <p>Your operator registration request has been rejected by the department.</p>

      <p>Please contact the department for more information.</p>
    `
  });

};


/*when issue is assigned to department*/
export const sendIssueAssignedToDepartmentEmail = async (department, issue, operator) => {

  await transporter.sendMail({
    from: process.env.EMAIL,
    to: department.email,
    subject: "🚨 New Issue Assigned",

    html: `
      <h2>New Issue Assigned</h2>

      <p><b>Title:</b> ${issue.title}</p>
      <p><b>Category:</b> ${issue.category}</p>
      <p><b>Zone:</b> ${issue.zone}</p>
      <p><b>Priority:</b> ${issue.priority.level}</p>

      <hr/>

      <p><b>Assigned Operator:</b> ${operator.fullName}</p>
      <p><b>Operator Email:</b> ${operator.email}</p>

      <p>Please monitor this issue in your dashboard.</p>
    `
  });

};



/*email to operator when issue is assigned to them*/
export const sendIssueAssignedToOperatorEmail = async (operator, issue) => {

  await transporter.sendMail({
    from: process.env.EMAIL,
    to: operator.email,
    subject: "📌 New Task Assigned",

    html: `
      <h2>You Have a New Issue</h2>

      <p><b>Title:</b> ${issue.title}</p>
      <p><b>Category:</b> ${issue.category}</p>
      <p><b>Zone:</b> ${issue.zone}</p>
      <p><b>Priority:</b> ${issue.priority.level}</p>

      <p><b>Description:</b> ${issue.description.text}</p>

      <p>Please resolve this issue as soon as possible.</p>
    `
  });

};


/*===========email to admin for issue assignment===========*/
export const sendIssueToAdminEmail = async (issue, department, operator) => {

  await transporter.sendMail({
    from: process.env.EMAIL,
    to: process.env.ADMIN_EMAIL,
    subject: "📢 New Issue Created & Assigned",

    html: `
      <h2>New Issue Reported</h2>

      <p><b>Title:</b> ${issue.title}</p>
      <p><b>Category:</b> ${issue.category}</p>
      <p><b>Zone:</b> ${issue.zone}</p>
      <p><b>Priority:</b> ${issue.priority.level}</p>

      <hr/>

      <h3>Assignment Details</h3>

      <p><b>Department:</b> ${department.departmentName}</p>
      <p><b>Operator:</b> ${operator.fullName}</p>

      <hr/>

      <p>Please monitor this issue from admin dashboard.</p>
    `
  });

};

/*send email when sla timer over*/
export const sendEscalationEmail = async (issue, department, operator) => {

  const html = `
    <h2>🚨 Issue Escalated</h2>

    <p><b>Title:</b> ${issue.title}</p>
    <p><b>Category:</b> ${issue.category}</p>
    <p><b>Priority:</b> ${issue.priority.level}</p>
    <p><b>Zone:</b> ${issue.zone}</p>

    <hr/>

    <p><b>Department:</b> ${department?.departmentName}</p>
    <p><b>Operator:</b> ${operator?.fullName}</p>

    <p style="color:red;"><b>Deadline missed! Immediate action required.</b></p>
  `;

  // Admin
  await transporter.sendMail({
    to: process.env.ADMIN_EMAIL,
    subject: "🚨 SLA Breach Alert",
    html
  });

  // Department
  if (department?.email) {
    await transporter.sendMail({
      to: department.email,
      subject: "🚨 Issue Escalated",
      html
    });
  }

  // Operator
  if (operator?.email) {
    await transporter.sendMail({
      to: operator.email,
      subject: "⚠️ Issue Escalated",
      html
    });
  }
};
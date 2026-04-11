import dotenv from "dotenv";
dotenv.config({ path: "./.env" });
import nodemailer from "nodemailer";

// Configure Nodemailer Transporter
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // Use SSL for deployment safety
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS, // Using your new variable name
  },
});

// Verify SMTP Connection on Startup
transporter.verify((error, success) => {
  if (error) {
    console.error("❌ SMTP Connection Error:", error.message);
  } else {
    console.log("✅ SMTP Server is ready to send emails");
  }
});

// Debugging wrapper for all emails
export const sendEmail = async (msg) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL,
      to: msg.to,
      subject: msg.subject,
      html: msg.html,
    };

    await transporter.sendMail(mailOptions);
    console.log(`📧 Email sent to ${msg.to} (Subject: ${msg.subject})`);
  } catch (error) {
    console.error("❌ Nodemailer Error:", error.message);
    throw error;
  }
};
export { transporter };

const generateEmailTemplate = (title, subtitle, details, actionLabel, actionUrl, statusColor = "#3b82f6") => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
      <div style="background-color: ${statusColor}; padding: 20px; color: #ffffff;">
        <h1 style="margin: 0; font-size: 24px;">${title}</h1>
        <p style="margin: 5px 0 0; font-size: 14px; opacity: 0.9;">${subtitle}</p>
      </div>
      <div style="padding: 20px; color: #333;">
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          ${details.map(d => `
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #666; font-size: 12px; width: 40%; text-transform: uppercase;">${d.label}</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: bold;">${d.value}</td>
            </tr>
          `).join("")}
        </table>
        ${actionUrl ? `
          <div style="text-align: center; margin-top: 20px;">
            <a href="${actionUrl}" style="background-color: #1e293b; color: #ffffff; padding: 12px 25px; border-radius: 5px; text-decoration: none; font-weight: bold; display: inline-block;">
              ${actionLabel}
            </a>
          </div>
        ` : ""}
      </div>
      <div style="background-color: #f9f9f9; padding: 15px; text-align: center; color: #999; font-size: 11px;">
        <p style="margin: 0;">PublicPlus Metropolitan Intelligence</p>
      </div>
    </div>
  `;
};

/* ============================================================ */
/* DEPARTMENT WORKFLOW                                         */
/* ============================================================ */

export const sendDepartmentRegistrationEmail = async (department) => {
  const details = [
    { label: "Department Name", value: department.departmentName },
    { label: "Contact Email", value: department.email },
    { label: "Status", value: "Pending Approval" }
  ];
  const html = generateEmailTemplate(
    "New Registration Request",
    "Metropolitan Department Incoming",
    details,
    "Review Application",
    "https://public-plus.vercel.app/admin/departments"
  );

  await sendEmail({
    from: process.env.EMAIL,
    to: process.env.ADMIN_EMAIL,
    subject: "New Department Registration: " + department.departmentName,
    html
  });
};

export const sendDepartmentRegistrationConfirmation = async (department) => {
  const details = [
    { label: "Department", value: department.departmentName },
    { label: "Code", value: department.departmentCode },
    { label: "Status", value: "AWAITING ADMIN APPROVAL" }
  ];
  const html = generateEmailTemplate(
    "Application Logged",
    "Registration Received",
    details,
    null,
    null,
    "#3b82f6"
  );

  await sendEmail({
    from: process.env.EMAIL,
    to: department.email,
    subject: "Application Received: " + department.departmentName,
    html
  });
};

export const sendDepartmentApprovedEmail = async (department) => {
  const details = [
    { label: "Department", value: department.departmentName },
    { label: "Status", value: "Approved" },
    { label: "Access", value: "Full Portal Access Granted" }
  ];
  const html = generateEmailTemplate(
    "Welcome to PublicPlus",
    "Department Account Activated",
    details,
    "Access Portal",
    "https://public-plus.vercel.app/login"
  );
  await sendEmail({
    from: process.env.EMAIL,
    to: department.email,
    subject: "Department Approved",
    html
  });
};

export const sendDepartmentRejectedEmail = async (department) => {
  const details = [
    { label: "Department", value: department.departmentName },
    { label: "Status", value: "Rejected" }
  ];
  const html = generateEmailTemplate(
    "Registration Update",
    "Application Status Notification",
    details,
    "Contact Support",
    "https://public-plus.vercel.app/support",
    "#ef4444"
  );
  await sendEmail({
    from: process.env.EMAIL,
    to: department.email,
    subject: "Department Registration Rejected",
    html
  });
};

/* ============================================================ */
/* OPERATOR WORKFLOW                                           */
/* ============================================================ */

export const sendOperatorRequestEmail = async (operator, departmentEmail) => {
  const details = [
    { label: "Operator Name", value: operator.fullName },
    { label: "Email", value: operator.email },
    { label: "Status", value: "Pending Review" }
  ];
  const html = generateEmailTemplate(
    "Operator Application",
    "New Personnel Request",
    details,
    "Review Application",
    "https://public-plus.vercel.app/department/operators"
  );
  await sendEmail({
    from: process.env.EMAIL,
    to: departmentEmail,
    subject: "New Operator Registration Request",
    html
  });
};

export const sendOperatorApprovedEmail = async (operator) => {
  const details = [
    { label: "Operator", value: operator.fullName },
    { label: "Assigned Zone", value: operator.assignedZone?.zoneName || "General Area" },
    { label: "Status", value: "Active" }
  ];
  const html = generateEmailTemplate(
    "Account Verified",
    "Personnel Access Granted",
    details,
    "Login to Portal",
    "https://public-plus.vercel.app/login"
  );
  await sendEmail({
    from: process.env.EMAIL,
    to: operator.email,
    subject: "Operator Account Approved",
    html
  });
};

export const sendOperatorRejectedEmail = async (operator) => {
  const details = [
    { label: "Operator", value: operator.fullName },
    { label: "Status", value: "Rejected" }
  ];
  const html = generateEmailTemplate(
    "Application Status",
    "Personnel Update",
    details,
    "Contact Department",
    "https://public-plus.vercel.app/support",
    "#ef4444"
  );
  await sendEmail({
    from: process.env.EMAIL,
    to: operator.email,
    subject: "Operator Application Rejected",
    html
  });
};

/* ============================================================ */
/* ISSUE ASSIGNMENT WORKFLOW                                  */
/* ============================================================ */

export const sendIssueAssignedToDepartmentEmail = async (department, issue, operator) => {
  const details = [
    { label: "Mission ID", value: `#${issue._id.toString().slice(-8).toUpperCase()}` },
    { label: "Mission Title", value: issue.title },
    { label: "Sector", value: issue.category?.label || "General" },
    { label: "Priority", value: (issue.priority?.level || "Medium").toUpperCase() },
    { label: "Primary Zone", value: issue.zone || "Alpha Sector" },
    { label: "Deployment", value: operator ? `${operator.fullName}` : "Awaiting Selection" }
  ];

  const html = generateEmailTemplate(
    "New Incident Logged",
    "Mission Assigned to Department",
    details,
    "Initialize Response",
    "https://public-plus.vercel.app/department/issues"
  );

  await sendEmail({
    from: process.env.EMAIL,
    to: department.email,
    subject: `🚨 [ALERT] New Incident Assigned: ${issue.title}`,
    html
  });
};

export const sendIssueAssignedToOperatorEmail = async (operator, issue) => {
  const details = [
    { label: "Mission ID", value: `#${issue._id.toString().slice(-8).toUpperCase()}` },
    { label: "Mission Title", value: issue.title },
    { label: "Area", value: issue.zone },
    { label: "Status", value: "Assigned" }
  ];
  const html = generateEmailTemplate(
    "New Task Received",
    "Assignment Notification",
    details,
    "View Task Details",
    "https://public-plus.vercel.app/operator/tasks"
  );
  await sendEmail({
    from: process.env.EMAIL,
    to: operator.email,
    subject: "📌 Task Assignment: " + issue.title,
    html
  });
};

export const sendIssueToAdminEmail = async (issue, department, operator) => {
  const details = [
    { label: "Mission ID", value: `#${issue._id.toString().slice(-8).toUpperCase()}` },
    { label: "Subject", value: issue.title },
    { label: "Department", value: department?.departmentName || "General" },
    { label: "Status", value: operator ? `Assigned to ${operator.fullName}` : "Awaiting Manual Operator" }
  ];
  const html = generateEmailTemplate(
    "New Issue Created",
    "Administrative Alert",
    details,
    "View Dashboard",
    "https://public-plus.vercel.app/admin"
  );
  await sendEmail({
    from: process.env.EMAIL,
    to: process.env.ADMIN_EMAIL,
    subject: "📢 Incident Alert: " + issue.title,
    html
  });
};

/* ============================================================ */
/* CITIZEN FEEDBACK & VERIFICATION                              */
/* ============================================================ */

export const sendVerificationEmail = async (userEmail, issueTitle, operatorName, proofUrl, issueId) => {
  const details = [
    { label: "Mission Title", value: issueTitle },
    { label: "Operator Involved", value: operatorName },
    { label: "Current Status", value: "PENDING VERIFICATION" }
  ];

  const html = generateEmailTemplate(
    "Resolution Submitted",
    "Verification Protocol Required",
    details,
    "Verify Mission Resolution",
    `https://public-plus.vercel.app/issue/${issueId}`,
    "#10b981"
  );

  await sendEmail({
    from: process.env.EMAIL,
    to: userEmail,
    subject: `[ACTION REQUIRED] Verify Resolution: ${issueTitle}`,
    html
  });
};

export const sendReopenedEmail = async (operatorEmail, issueTitle, reasonProofUrl) => {
  const details = [
    { label: "Mission Title", value: issueTitle },
    { label: "Status", value: "REJECTED" },
    { label: "Action", value: "Re-evaluation Required" }
  ];
  const html = generateEmailTemplate(
    "Resolution Rejected",
    "Citizen Feedback Alert",
    details,
    "Review Feedback",
    "https://public-plus.vercel.app/operator/tasks",
    "#ef4444"
  );
  await sendEmail({
    from: process.env.EMAIL,
    to: operatorEmail,
    subject: "🚨 Reopened: " + issueTitle,
    html: `<h2>Action Required: Resolution Rejected</h2>
           <p>The citizen has rejected the proof for ${issueTitle}. Please resolve immediately.</p>`
  });
};

export const sendIssueResolvedEmail = async (operatorEmail, issueTitle, rating) => {
  await sendEmail({
    from: process.env.EMAIL,
    to: operatorEmail,
    subject: "✅ Resolution Verified",
    html: `<h2>Work Verified</h2>
           <p>The resolution for <b>${issueTitle}</b> has been approved.</p>
           <p><b>Rating:</b> ⭐ ${rating}/5</p>`
  });
};

export const sendEscalationEmail = async (issue, department, operator) => {
  const details = [
    { label: "Mission ID", value: `#${issue._id.toString().slice(-8).toUpperCase()}` },
    { label: "Mission Title", value: issue.title },
    { label: "Escalation Status", value: "SLA THRESHOLD BREACHED" },
    { label: "Administrative State", value: "ESCALATED" },
    { label: "Dept Responsible", value: department?.departmentName || "General" }
  ];

  const html = generateEmailTemplate(
    "Mission Escalated",
    "Metropolitan Intelligence Alert",
    details,
    "Review Escalated Mission",
    "https://public-plus.vercel.app/admin",
    "#ef4444"
  );

  const subjects = `🚨 [CRITICAL] Mission Escalated: ${issue.title}`;

  await sendEmail({ from: process.env.EMAIL, to: process.env.ADMIN_EMAIL, subject: subjects, html });
  if (department?.email) await sendEmail({ from: process.env.EMAIL, to: department.email, subject: subjects, html });
  if (operator?.email) await sendEmail({ from: process.env.EMAIL, to: operator.email, subject: subjects, html });
};

export const sendCriticalEscalationEmail = async (issue) => {
  const details = [
    { label: "Critical ID", value: `#${issue._id.toString().slice(-8).toUpperCase()}` },
    { label: "Mission", value: issue.title },
    { label: "Sector", value: issue.zone },
    { label: "Level", value: "3+ (EMERGENCY OVERRIDE)" },
    { label: "Protocol", value: "ADMINISTRATIVE INTERVENTION" }
  ];

  const html = generateEmailTemplate(
    "CRITICAL MISSION BREACH",
    "DEEP ESCALATION LEVEL 3 ALERT",
    details,
    "OVERRIDE MISSION",
    "https://public-plus.vercel.app/admin/issues",
    "#7f1d1d"
  );

  const subject = `🚨 [EMERGENCY] Level 3 Breach: ${issue.title}`;
  await sendEmail({ from: process.env.EMAIL, to: process.env.ADMIN_EMAIL, subject, html });
};

export const sendIssueClosedEmail = async (userEmail, issueTitle, operatorName, remark) => {
  const details = [
    { label: "Mission Title", value: issueTitle },
    { label: "Resolved By", value: operatorName },
    { label: "Resolution Status", value: "CLOSED (INVALID ISSUE)" },
    { label: "Operator Note", value: remark }
  ];

  const html = generateEmailTemplate(
    "Mission Status Update",
    "Mission Resolved/Closed",
    details,
    "Verify Status",
    `https://public-plus.vercel.app/dashboard`,
    "#ef4444"
  );

  await sendEmail({
    from: process.env.EMAIL,
    to: userEmail,
    subject: `[UPDATE] Mission Closed: ${issueTitle}`,
    html
  });
};

export const sendOTPEmail = async (email, otp) => {
  const details = [
    { label: "Protocol", value: "SIGNUP VERIFICATION" },
    { label: "Validation Code", value: `<span style="font-size: 24px; color: #1e293b; letter-spacing: 5px;">${otp}</span>` },
    { label: "Valid For", value: "10 MINUTES" }
  ];

  const html = generateEmailTemplate(
    "Security Matrix: Verification",
    "One-Time Password Generated",
    details,
    "Complete Registration",
    null,
    "#3b82f6"
  );

  await sendEmail({
    from: process.env.EMAIL,
    to: email,
    subject: `[OTP] Your Verification Code: ${otp}`,
    html
  });
};
/* ============================================================ */
/* NEW: ISSUE CREATED CONFIRMATION                              */
/* ============================================================ */

export const sendIssueReportedEmailToCitizen = async (userEmail, issue) => {
  const details = [
    { label: "Mission ID", value: `#${issue._id.toString().slice(-8).toUpperCase()}` },
    { label: "Mission Title", value: issue.title },
    { label: "Category", value: issue.category?.label || "General Infrastructure" },
    { label: "Status", value: "PROTOCOL INITIALIZED" }
  ];

  const html = generateEmailTemplate(
    "Report Received",
    "Citizen Broadcast Logged",
    details,
    "Track Progress",
    "https://public-plus.vercel.app/dashboard",
    "#10b981"
  );

  await sendEmail({
    from: process.env.EMAIL,
    to: userEmail,
    subject: `[CONFIRMED] Report Logged: ${issue.title}`,
    html
  });
};

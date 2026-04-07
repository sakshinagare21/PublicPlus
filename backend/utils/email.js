import dotenv from "dotenv";
dotenv.config({ path: "./.env" });
import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for port 465, false for other ports
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS
  }
});

// Verify SMTP connection
transporter.verify((error) => {
  if (error) console.log("SMTP Error:", error);
  else console.log("SMTP Server Ready");
});

const generateEmailTemplate = (title, subtitle, details, actionLabel, actionUrl, statusColor = "#3b82f6") => {
  return `
    <div style="font-family: 'Inter', system-ui, -apple-system, sans-serif; max-width: 650px; margin: auto; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 24px; overflow: hidden; box-shadow: 0 20px 50px rgba(0,0,0,0.05);">
      <div style="background-color: ${statusColor}; padding: 48px 40px; text-align: left; position: relative; overflow: hidden;">
        <div style="position: absolute; top: -50px; right: -50px; width: 150px; hieght: 150px; background-color: rgba(255,255,255,0.1); border-radius: 50%;"></div>
        <h1 style="color: #ffffff; margin: 0; font-size: 32px; font-weight: 800; letter-spacing: -1px; line-height: 1.1;">${title}</h1>
        <p style="color: rgba(255,255,255,0.9); margin-top: 12px; font-size: 14px; font-weight: 600; letter-spacing: 2px;">${subtitle}</p>
      </div>
      
      <div style="padding: 40px;">
        <div style="background-color: #f8fafc; border-radius: 20px; padding: 32px; margin-bottom: 32px; border: 1px solid #f1f5f9;">
          <table style="width: 100%; border-collapse: collapse;">
            ${details.map(d => `
              <tr style="border-bottom: 1px solid #e2e8f0;">
                <td style="padding: 16px 0; color: #64748b; font-size: 11px; font-weight: 800; letter-spacing: 1px; width: 35%;">${d.label}</td>
                <td style="padding: 16px 0; color: #1e293b; font-size: 14px; font-weight: 700;">${d.value}</td>
              </tr>
            `).join("")}
          </table>
        </div>

        ${actionUrl ? `
          <div style="text-align: center;">
            <a href="${actionUrl}" style="display: inline-block; background-color: #1e293b; color: #ffffff; padding: 18px 40px; border-radius: 16px; text-decoration: none; font-weight: 800; font-size: 12px; letter-spacing: 2px; box-shadow: 0 10px 30px rgba(30,41,59,0.2);">
              ${actionLabel}
            </a>
          </div>
        ` : ""}
      </div>
      
      <div style="background-color: #f1f5f9; padding: 24px; text-align: center;">
        <p style="margin: 0; color: #94a3b8; font-size: 10px; font-weight: 700; letter-spacing: 1.5px;">PublicPlus Metropolitan Intelligence Matrix</p>
        <p style="margin-top: 8px; color: #cbd5e1; font-size: 9px;">Automated system notification. Secure encrypted transmission.</p>
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
    "http://localhost:5173/admin/departments"
  );

  await transporter.sendMail({
    from: process.env.EMAIL,
    to: process.env.ADMIN_EMAIL,
    subject: "New Department Registration: " + department.departmentName,
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
    "http://localhost:5173/login"
  );
  await transporter.sendMail({
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
    "http://localhost:5173/support",
    "#ef4444"
  );
  await transporter.sendMail({
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
    "http://localhost:5173/department/operators"
  );
  await transporter.sendMail({
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
    "http://localhost:5173/login"
  );
  await transporter.sendMail({
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
    "http://localhost:5173/support",
    "#ef4444"
  );
  await transporter.sendMail({
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
    "http://localhost:5173/department/issues"
  );

  await transporter.sendMail({
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
    "http://localhost:5173/operator/tasks"
  );
  await transporter.sendMail({
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
    "http://localhost:5173/admin"
  );
  await transporter.sendMail({
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
    `http://localhost:5173/issue/${issueId}`,
    "#10b981"
  );

  await transporter.sendMail({
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
    "http://localhost:5173/operator/tasks",
    "#ef4444"
  );
  await transporter.sendMail({
    from: process.env.EMAIL,
    to: operatorEmail,
    subject: "🚨 Reopened: " + issueTitle,
    html: `<h2>Action Required: Resolution Rejected</h2>
           <p>The citizen has rejected the proof for ${issueTitle}. Please resolve immediately.</p>`
  });
};

export const sendIssueResolvedEmail = async (operatorEmail, issueTitle, rating) => {
  await transporter.sendMail({
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
    "http://localhost:5173/admin",
    "#ef4444"
  );
  
  const subjects = `🚨 [CRITICAL] Mission Escalated: ${issue.title}`;

  await transporter.sendMail({ from: process.env.EMAIL, to: process.env.ADMIN_EMAIL, subject: subjects, html });
  if (department?.email) await transporter.sendMail({ from: process.env.EMAIL, to: department.email, subject: subjects, html });
  if (operator?.email) await transporter.sendMail({ from: process.env.EMAIL, to: operator.email, subject: subjects, html });
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
    "http://localhost:5173/admin/issues",
    "#7f1d1d" // Dark blood red for critical
  );

  const subject = `🚨 [EMERGENCY] Level 3 Breach: ${issue.title}`;
  await transporter.sendMail({ from: process.env.EMAIL, to: process.env.ADMIN_EMAIL, subject, html });
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
    `http://localhost:5173/dashboard`,
    "#ef4444"
  );

  await transporter.sendMail({
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

  await transporter.sendMail({
    from: process.env.EMAIL,
    to: email,
    subject: `[OTP] Your Verification Code: ${otp}`,
    html
  });
};
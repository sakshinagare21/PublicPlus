import nodemailer from "nodemailer";
import dotenv from "dotenv";
import path from "path";

dotenv.config();

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  auth: {
    user: process.env.BREVO_SMTP_USER || process.env.EMAIL,
    pass: process.env.BERVO_API_KEY,
  },
});

async function test() {
  console.log("Testing connection with user:", process.env.BREVO_SMTP_USER || process.env.EMAIL);

  try {
    await transporter.verify();
    console.log("✅ SMTP Connection OK");
    
    console.log("Attempting to send test email to:", process.env.ADMIN_EMAIL);
    const info = await transporter.sendMail({
      from: `"PublicPlus Test" <${process.env.EMAIL}>`,
      to: process.env.ADMIN_EMAIL,
      subject: "Test Email from Brevo SMTP",
      text: "If you received this, Brevo SMTP is working!",
      html: "<b>If you received this, Brevo SMTP is working!</b>",
    });
    console.log("✅ Message sent: %s", info.messageId);
  } catch (error) {
    console.error("❌ Test Failed:", error.message);
    if (error.response) console.error("Response:", error.response);
  }
}

test();

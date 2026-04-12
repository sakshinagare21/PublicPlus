import dotenv from "dotenv";
import nodemailer from "nodemailer";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "../backend/.env") });

async function testEmail() {
  console.log("Testing Brevo SMTP implementation...");
  console.log("Host: smtp-relay.brevo.com");
  console.log("Email:", process.env.EMAIL);
  console.log("Key present:", !!process.env.BERVO_API_KEY);

  const transporter = nodemailer.createTransport({
    host: "smtp-relay.brevo.com",
    port: 587,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.BERVO_API_KEY,
    },
  });

  try {
    await transporter.verify();
    console.log("✅ SMTP Connection established successfully!");
  } catch (error) {
    console.error("❌ SMTP Connection failed:", error.message);
  }
}

testEmail();

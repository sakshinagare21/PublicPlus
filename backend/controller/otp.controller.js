import OTP from "../models/otp.model.js";
import { sendOTPEmail } from "../utils/email.js";

export const sendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    console.time("OTP-Flow");
    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // PHASE 1: DATABASE
    try {
      await OTP.findOneAndUpdate(
        { email },
        { otp, createdAt: new Date() },
        { upsert: true, new: true }
      );
      console.timeLog("OTP-Flow", "=> DB Save Complete");
    } catch (dbError) {
      console.error("Database Save Error:", dbError);
      return res.status(500).json({ message: "Failed to save OTP to database" });
    }

    // PHASE 2: EMAIL SENDING (Backgrounded)
    sendOTPEmail(email, otp).catch(err => console.log("Email error:", err.message));
    console.timeEnd("OTP-Flow");

    res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error("Critical Send OTP Error:", error);
    res.status(500).json({ message: "Unexpected server error during OTP flow" });
  }
};

export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    const otpRecord = await OTP.findOne({ email });

    if (!otpRecord) {
      return res.status(400).json({ message: "OTP expired or not found" });
    }

    if (otpRecord.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // Optional: Delete OTP after successful verification
    await OTP.deleteOne({ email });

    res.status(200).json({ message: "OTP verified successfully" });
  } catch (error) {
    console.error("Verify OTP Error:", error);
    res.status(500).json({ message: error.message });
  }
};

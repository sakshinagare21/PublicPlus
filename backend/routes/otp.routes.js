import express from "express";
import { sendOTP, verifyOTP } from "../controller/otp.controller.js";
import { otpLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();

router.post("/send-otp", otpLimiter, sendOTP);
router.post("/verify-otp", otpLimiter, verifyOTP);

export default router;

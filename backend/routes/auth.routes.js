import express from "express";
import { firebaseAuth } from "../middleware/firebase.middleware.js";
import { detectUserRole } from "../controller/auth.middleware.js";

const router = express.Router();

router.get("/detect-role", firebaseAuth, detectUserRole);

export default router;
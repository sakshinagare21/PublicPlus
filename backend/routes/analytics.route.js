import express from "express";
import { firebaseAuth, verifyAdmin, attachUser } from "../middleware/firebase.middleware.js";
import { getAdminAnalytics, getUserAnalytics } from "../controller/analytics.controller.js";

const router = express.Router();

router.get("/admin", firebaseAuth, verifyAdmin, getAdminAnalytics);
router.get("/citizen", firebaseAuth, attachUser, getUserAnalytics);

export default router;

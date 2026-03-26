import express from "express";
import { setSLA, getSLA } from "../controller/sla.controller.js";
import { firebaseAuth, verifyAdmin } from "../middleware/firebase.middleware.js";

const router = express.Router();

/* 🔥 SET SLA */
router.post("/set-sla", firebaseAuth, verifyAdmin, setSLA);

/* 🔥 GET SLA */
router.get("/get-sla", firebaseAuth, verifyAdmin, getSLA);

export default router;
import express from "express";
import {
  addIssueType,
  getIssueTypes,
  deleteIssueType
} from "../controller/issueType.controller.js";

import { firebaseAuth, verifyAdmin } from "../middleware/firebase.middleware.js";

const router = express.Router();

/* 🔥 ADMIN */
router.post("/", firebaseAuth, verifyAdmin, addIssueType);
router.delete("/:id", firebaseAuth, verifyAdmin, deleteIssueType);

/* 🔥 COMMON */
router.get("/", firebaseAuth, getIssueTypes);

export default router;
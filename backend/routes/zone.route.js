import express from "express";
import { firebaseAuth, verifyAdmin } from "../middleware/firebase.middleware.js";
import {
  createZone,
  getAllZones,
  getSingleZone,
  updateZone,
  deleteZone,
} from "../controller/zone.controller.js";

const router = express.Router();

// @route GET /api/zones
router.get("/", firebaseAuth, getAllZones);

// @route GET /api/zones/:id
router.get("/:id", firebaseAuth, getSingleZone);

// @route POST /api/zones
router.post("/", firebaseAuth, verifyAdmin, createZone);

// @route PUT /api/zones/:id
router.put("/:id", firebaseAuth, verifyAdmin, updateZone);

// @route DELETE /api/zones/:id
router.delete("/:id", firebaseAuth, verifyAdmin, deleteZone);

export default router;

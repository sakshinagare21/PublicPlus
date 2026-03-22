import express from "express";

import {
  createProfile,
  firebaseLogin,
  getUserProfile,
  updateUserProfile,
  updateLocation,
  addDevice,
  updateNotificationSettings,
  getAllUsers,
  blockUser,
  deleteUser,
  getUserReports,
} from "../controller/user.controller.js";

import { firebaseAuth } from "../middleware/firebase.middleware.js";

const router = express.Router();


// ================= FIREBASE AUTH ROUTES =================

// create profile after firebase signup
router.post("/create-profile", firebaseAuth, createProfile);

// login (firebase verify only)
router.post("/login", firebaseAuth, firebaseLogin);


// ================= USER PROTECTED ROUTES =================

router.get("/profile", firebaseAuth, getUserProfile);
router.put("/profile", firebaseAuth, updateUserProfile);

router.put("/location", firebaseAuth, updateLocation);
router.post("/device", firebaseAuth, addDevice);

router.put("/notifications", firebaseAuth, updateNotificationSettings);
router.get("/reports", firebaseAuth, getUserReports);

// ================= ADMIN ROUTES =================

router.get("/", getAllUsers);
router.put("/block/:id", blockUser);
router.delete("/:id", deleteUser);

export default router;
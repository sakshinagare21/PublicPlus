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

import { firebaseAuth, attachUser } from "../middleware/firebase.middleware.js";

const router = express.Router();


// ================= FIREBASE AUTH ROUTES =================

// create profile after firebase signup
router.post("/create-profile", firebaseAuth, createProfile);

// login (firebase verify only)
router.post("/login", firebaseAuth, firebaseLogin);


// ================= USER PROTECTED ROUTES =================

router.get("/profile", firebaseAuth, attachUser, getUserProfile);
router.put("/profile", firebaseAuth, attachUser, updateUserProfile);

router.put("/location", firebaseAuth, attachUser, updateLocation);
router.post("/device", firebaseAuth, attachUser, addDevice);

router.put("/notifications", firebaseAuth, attachUser, updateNotificationSettings);
router.get("/reports", firebaseAuth, attachUser, getUserReports);

// ================= ADMIN ROUTES =================

router.get("/", getAllUsers);
router.put("/block/:id", blockUser);
router.delete("/:id", deleteUser);

export default router;
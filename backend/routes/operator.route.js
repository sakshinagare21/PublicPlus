import express from "express";
import multer from "multer";

import { firebaseAuth } from "../middleware/firebase.middleware.js";
import { verifyOperator } from "../middleware/firebase.middleware.js";
import { uploadProofImage } from "../middleware/upload.js";
import {
  getOperatorDashboard,
  getOperatorProfile,
  registerOperator,
  operatorLogin
} from "../controller/operator.controller.js";
import {
  getOperatorProfileByDept,
  getOperatorStatsByDept,
  deleteOperator
} from "../controller/operator.controller.js";
import { verifyDepartment } from "../middleware/firebase.middleware.js";
const upload = multer({ dest: "uploads/" });

const router = express.Router();
router.post("/register",firebaseAuth,registerOperator);

router.post("/login",firebaseAuth,verifyOperator,operatorLogin);
router.get("/dashboard", firebaseAuth, verifyOperator, getOperatorDashboard);


/*====get operator profile====*/
router.get(
  "/profile",
  firebaseAuth,
  verifyOperator,
  getOperatorProfile
);

/*department view operator profile and stats*/
router.get(
  "/department/operator/:operatorId",
  firebaseAuth,
  verifyDepartment,
  getOperatorProfileByDept
);

router.get(
  "/department/operator/:operatorId/stats",
  firebaseAuth,
  verifyDepartment,
  getOperatorStatsByDept
);

router.delete(
  "/department/operator/:operatorId",
  firebaseAuth,
  verifyDepartment,
  deleteOperator
);

export default router;
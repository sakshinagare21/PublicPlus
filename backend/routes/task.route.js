import express from "express";
import { firebaseAuth } from "../middleware/firebase.middleware.js";
import { verifyDepartment } from "../middleware/firebase.middleware.js";
import { verifyOperator } from "../middleware/firebase.middleware.js";
import { uploadProofImage } from "../middleware/upload.js";

import {
  createTask,
  getDepartmentTasks,
  getMyTasks,
  updateTaskStatus,
  addTaskRemark,
  deleteTask
} from "../controller/task.controller.js";

const router = express.Router();

/* Department */
router.post("/", firebaseAuth, verifyDepartment, createTask);
router.get("/department", firebaseAuth, verifyDepartment, getDepartmentTasks);
router.delete("/:taskId", firebaseAuth, verifyDepartment, deleteTask);

/* Operator */
router.get("/my", firebaseAuth, verifyOperator, getMyTasks);
router.put("/:taskId/status", firebaseAuth, verifyOperator, updateTaskStatus);
router.post("/:taskId/remark",
  firebaseAuth,
  verifyOperator,
  uploadProofImage.single("image"),
  addTaskRemark
);

export default router;
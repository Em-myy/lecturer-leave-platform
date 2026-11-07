import express from "express";
import {
  applyForLeave,
  getAllLeaves,
  getLeaveById,
  getLeaves,
  updateLeaveStatus,
} from "../controller/leaveController.js";

const router = express.Router();

// lecturer routes
router.post("/", applyForLeave);
router.get("/", getLeaves);

// hod routes
router.get("/all-leaves", getAllLeaves);

router.get("/:leaveId", getLeaveById);
router.patch("/:leaveId/status", updateLeaveStatus);

export default router;

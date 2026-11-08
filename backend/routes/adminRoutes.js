import express from "express";
import {
  getAllLeaves,
  getLeaveById,
  updateLeaveStatus,
  getPendingHodRequests,
  approveHodRequest,
  rejectHodRequest,
} from "../controller/adminController.js";

const router = express.Router();

router.get("/all-leaves", getAllLeaves);

router.get("/:leaveId", getLeaveById);
router.patch("/:leaveId/status", updateLeaveStatus);

router.get("/requests", getPendingHodRequests);
router.post("/approve-hod", approveHodRequest);
router.post("/reject-hod", rejectHodRequest);

export default router;

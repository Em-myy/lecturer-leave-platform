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

router.get("/requests", getPendingHodRequests);
router.post("/approve-hod", approveHodRequest);
router.post("/reject-hod", rejectHodRequest);

router.get("/:leaveId", getLeaveById);
router.patch("/:leaveId/status", updateLeaveStatus);

export default router;

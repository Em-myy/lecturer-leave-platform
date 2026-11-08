import express from "express";
import {
  applyForLeave,
  getLeaves,
  requestHodRole,
} from "../controller/leaveController.js";

const router = express.Router();

// lecturer routes
router.post("/", applyForLeave);
router.get("/", getLeaves);

router.post("/request-hod", requestHodRole);

export default router;

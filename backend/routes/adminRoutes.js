import express from "express";
import {
  requestHodRole,
  getPendingHodRequests,
  approveHodRequest,
  rejectHodRequest,
} from "../controller/adminController.js";

const router = express.Router();

router.post("/request-hod", requestHodRole);
router.get("/requests", getPendingHodRequests);
router.post("/approve-hod", approveHodRequest);
router.post("/reject-hod", rejectHodRequest);

export default router;

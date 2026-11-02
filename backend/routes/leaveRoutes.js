import express from "express";
import { applyForLeave } from "../controller/leaveController.js";

const router = express.Router();

router.post("/", applyForLeave);

export default router;

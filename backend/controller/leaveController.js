import { auth } from "../utils/auth.js";
import { Leave } from "../models/Leave.js";

export const applyForLeave = async (req, res) => {
  try {
    const session = await auth.api.getSession({ headers: req.headers });

    if (!session || !session.user) {
      return res.status(401).json({ error: "Unauthorized. Please log in" });
    }

    if (session.user.role !== "lecturer") {
      return res
        .status(403)
        .json({ error: "Only lecturers can apply for leave" });
    }

    const { startDate, endDate, reason } = req.body;

    const newLeave = await Leave.create({
      lecturerId: session.user.id,
      lecturerName: session.user.name,
      department: session.user.department,
      startDate,
      endDate,
      reason,
    });

    res.status(201).json(newLeave);
  } catch (error) {
    console.error("Leave application error", error);
    res.status(500).json({ error: "Failed to submit leave request" });
  }
};

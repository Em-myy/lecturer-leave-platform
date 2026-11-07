import { supabase } from "../utils/supabase.js";

export const applyForLeave = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader ? authHeader.split(" ")[1] : null;

    if (!token) {
      return res.status(401).json({ error: "Unauthorized. No token provided" });
    }

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return res
        .status(401)
        .json({ error: "Unauthorized. Invalid or expired token" });
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("department, role")
      .eq("id", user.id)
      .single();

    if (profileError || profile.role !== "lecturer") {
      return res
        .status(403)
        .json({ error: "Only lecturers can apply for leave" });
    }

    const { startDate, endDate, reason } = req.body;

    const { data: newLeave, error: insertError } = await supabase
      .from("leave")
      .insert([
        {
          lecturer_id: user.id,
          department: profile.department,
          start_date: startDate,
          end_date: endDate,
          reason: reason,
          status: "pending",
        },
      ])
      .select()
      .single();

    if (insertError) {
      console.error("Supabase Insert Error:", insertError);
      return res.status(403).json({ error: insertError.message });
    }

    res.status(201).json(newLeave);
  } catch (error) {
    console.error("Leave application error", error);
    res.status(500).json({ error: "Failed to submit leave request" });
  }
};

export const getLeaves = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader ? authHeader.split(" ")[1] : null;

    if (!token) {
      return res.status(401).json({ error: "Unauthorized. No token provided" });
    }

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return res.status(401).json({ error: "Unauthorized. Invalid token" });
    }

    const { data: leaves, error: fetchError } = await supabase
      .from("leave")
      .select("*")
      .order("created_at", { ascending: false });

    if (fetchError) {
      throw fetchError;
    }

    res.status(200).json(leaves);
  } catch (error) {
    console.error("Fetch leaves error:", error);
    res.status(500).json({ error: "Failed to fetch leave history" });
  }
};

export const updateLeaveStatus = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader ? authHeader.split(" ")[1] : null;

    if (!token) return res.status(401).json({ error: "Unauthorized" });

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser(token);
    if (authError || !user)
      return res.status(401).json({ error: "Invalid token" });

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile?.role !== "hod") {
      return res
        .status(403)
        .json({ error: "Only HODs can update leave status" });
    }

    const { leaveId } = req.params;
    const { status } = req.body;

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ error: "Invalid status update" });
    }

    const { data: updatedLeave, error: updateError } = await supabase
      .from("leave")
      .update({ status: status })
      .eq("id", leaveId)
      .select()
      .single();

    if (updateError) throw updateError;

    res.status(200).json(updatedLeave);
  } catch (error) {
    console.error("Status update error:", error);
    res.status(500).json({ error: "Failed to update leave status" });
  }
};

export const getAllLeaves = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader ? authHeader.split(" ")[1] : null;

    if (!token) return res.status(401).json({ error: "Unauthorized" });

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser(token);
    if (authError || !user)
      return res.status(401).json({ error: "Invalid token" });

    const { data: profile } = await supabase
      .from("profiles")
      .select("role, department")
      .eq("id", user.id)
      .single();

    if (profile?.role !== "hod") {
      return res
        .status(403)
        .json({ error: "Only HODs can view department leaves" });
    }

    const { data: leaves, error: fetchError } = await supabase
      .from("leave")
      .select(
        `
        *,
        profiles ( fullname )
      `,
      )
      .eq("department", profile.department)
      .order("created_at", { ascending: false });

    if (fetchError) throw fetchError;

    res.status(200).json(leaves);
  } catch (error) {
    console.error("Fetch department leaves error:", error);
    res.status(500).json({ error: "Failed to fetch department leaves" });
  }
};

export const getLeaveById = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader ? authHeader.split(" ")[1] : null;

    if (!token) return res.status(401).json({ error: "Unauthorized" });

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser(token);
    if (authError || !user)
      return res.status(401).json({ error: "Invalid token" });

    const { leaveId } = req.params;

    const { data: leave, error: fetchError } = await supabase
      .from("leave")
      .select(
        `
        *,
        profiles ( fullname )
      `,
      )
      .eq("id", leaveId)
      .single();

    if (fetchError) {
      if (fetchError.code === "PGRST116") {
        return res
          .status(404)
          .json({ error: "Leave request not found or unauthorized" });
      }
      throw fetchError;
    }

    res.status(200).json(leave);
  } catch (error) {
    console.error("Fetch single leave error:", error);
    res.status(500).json({ error: "Failed to fetch leave details" });
  }
};

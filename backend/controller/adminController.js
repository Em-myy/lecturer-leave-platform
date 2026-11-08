import { supabase } from "../utils/supabase.js";

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

export const getPendingHodRequests = async () => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader ? authHeader.split(" ")[1] : null;
    const {
      data: { user },
    } = await supabase.auth.getUser(token);

    // Get current HOD's department
    const { data: hodProfile } = await supabase
      .from("profiles")
      .select("department, role")
      .eq("id", user.id)
      .single();

    if (hodProfile.role !== "hod")
      return res.status(403).json({ error: "Unauthorized" });

    // Fetch lecturers in the same department who have requested HOD status
    const { data: requests } = await supabase
      .from("profiles")
      .select("id, fullname, email")
      .eq("department", hodProfile.department)
      .eq("role_request", "pending_hod");

    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch requests" });
  }
};

export const approveHodRequest = async () => {
  try {
    const { targetUserId } = req.body; // The lecturer being promoted
    const authHeader = req.headers.authorization;
    const token = authHeader ? authHeader.split(" ")[1] : null;
    const {
      data: { user: currentHod },
    } = await supabase.auth.getUser(token);

    // 1. Verify current user is actually an HOD
    const { data: hodProfile } = await supabase
      .from("profiles")
      .select("department, role")
      .eq("id", currentHod.id)
      .single();

    if (hodProfile.role !== "hod")
      return res.status(403).json({ error: "Unauthorized" });

    // 2. Demote current HOD to lecturer
    await supabase
      .from("profiles")
      .update({ role: "lecturer" })
      .eq("id", currentHod.id);

    // 3. Promote the target user to HOD and clear their request
    await supabase
      .from("profiles")
      .update({ role: "hod", role_request: "none" })
      .eq("id", targetUserId)
      .eq("department", hodProfile.department); // Ensure they are in the same dept

    res.status(200).json({ message: "HOD Transfer Complete" });
  } catch (error) {
    res.status(500).json({ error: "Failed to approve HOD request" });
  }
};

export const rejectHodRequest = async () => {
  try {
    const { targetUserId } = req.body;
    const authHeader = req.headers.authorization;
    const token = authHeader ? authHeader.split(" ")[1] : null;
    const {
      data: { user: currentHod },
    } = await supabase.auth.getUser(token);

    // Verify current user is actually an HOD
    const { data: hodProfile } = await supabase
      .from("profiles")
      .select("department, role")
      .eq("id", currentHod.id)
      .single();

    if (hodProfile.role !== "hod")
      return res.status(403).json({ error: "Unauthorized" });

    // 1. Delete the user's authentication account permanently using the Admin API
    const { error: deleteError } =
      await supabase.auth.admin.deleteUser(targetUserId);

    if (deleteError) throw deleteError;

    await supabase.from("profiles").delete().eq("id", targetUserId);

    res.status(200).json({
      message: "Fraudulent request rejected. Account permanently deleted.",
    });
  } catch (error) {
    console.error("Reject HOD request error:", error);
    res.status(500).json({ error: "Failed to reject and delete account" });
  }
};

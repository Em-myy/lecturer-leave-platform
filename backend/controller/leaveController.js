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
      .eq("lecturer_id", user.id)
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

export const requestHodRole = async () => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader ? authHeader.split(" ")[1] : null;
    const {
      data: { user },
    } = await supabase.auth.getUser(token);

    // Update the profile's role_request column
    const { error } = await supabase
      .from("profiles")
      .update({ role_request: "pending_hod" })
      .eq("id", user.id);

    if (error) throw error;
    res.status(200).json({ message: "Request submitted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to submit request" });
  }
};

export const DEPARTMENTS = [
  "Data Science",
  "Cybersecurity",
  "Software Development",
  "Information Management",
  "Computer Science",
];

export interface LeaveRequest {
  id: string;
  start_date: string;
  end_date: string;
  reason: string;
  status: "pending" | "approved" | "rejected";
  created_at: string;
}

export interface HodLeaveRequest {
  id: string;
  start_date: string;
  end_date: string;
  reason: string;
  status: "pending" | "approved" | "rejected";
  profiles?: { fullname: string };
}

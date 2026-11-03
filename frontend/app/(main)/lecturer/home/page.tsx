"use client";

import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

const LecturerHomePage = () => {
  const { profile, handleSignOut } = useAuth();

  return (
    <div>
      <h1>{profile?.name}</h1>
      <h2>{profile?.email}</h2>
      <h3>{profile?.department}</h3>
      <h4>{profile?.role}</h4>

      <Link href="/lecturer/submit-leave">Request Leave</Link>

      <button type="button" onClick={() => handleSignOut()}>
        Sign Out
      </button>
    </div>
  );
};

export default LecturerHomePage;

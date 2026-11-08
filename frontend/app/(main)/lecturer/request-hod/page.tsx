"use client";

import { useAuth } from "@/context/AuthContext";
import apiClient from "@/lib/axios";
import { AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const RequestHodPage = () => {
  const { user, department, loading } = useAuth();
  const router = useRouter();

  const [submitting, setSubmitting] = useState<boolean>(false);

  const handleRequest = async () => {
    setSubmitting(true);
    try {
      await apiClient.post("/admin/request-hod");
      alert("Request submitted successfully to the current HOD.");
      router.push("/lecturer/home");
    } catch (error: any) {
      alert(error.response?.data?.error || "Failed to submit request.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-8 border rounded-xl shadow-sm bg-white">
      <h1 className="text-3xl font-bold mb-6 text-red-600">
        Elevate to Head of Department
      </h1>

      <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8">
        <h3 className="font-bold text-red-800 mb-2">
          <AlertCircle /> STRICT ADMINISTRATIVE WARNING
        </h3>
        <p className="text-red-700">
          This action will submit a formal request to transfer Head of
          Department (HOD) privileges for the <strong>{department}</strong>{" "}
          department to this account.
          <br />
          <br />
          <strong>
            If you request this role without being the newly appointed HOD, your
            account will be permanently deleted from the system.
          </strong>
        </p>
      </div>

      <button
        onClick={handleRequest}
        disabled={submitting}
        className="w-full bg-red-600 text-white font-bold py-3 rounded hover:bg-red-700 disabled:opacity-50 transition"
      >
        {submitting
          ? "Submitting Request..."
          : "I Accept the Risks - Request HOD Status"}
      </button>
    </div>
  );
};

export default RequestHodPage;

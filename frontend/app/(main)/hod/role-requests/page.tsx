"use client";

import { useAuth } from "@/context/AuthContext";
import apiClient from "@/lib/axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface HodRequest {
  id: string;
  fullname: string;
  email: string;
}

const HodRequestsPage = () => {
  const { loading, handleSignOut } = useAuth();
  const router = useRouter();

  const [requests, setRequests] = useState<HodRequest[]>([]);
  const [fetching, setFetching] = useState<boolean>(true);
  const [processing, setProcessing] = useState<string | null>(null);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await apiClient.get("/admin/requests");
        setRequests(response.data);
      } catch (error) {
        console.error("Failed to fetch role requests", error);
      } finally {
        setFetching(false);
      }
    };

    if (!loading) fetchRequests();
  }, [loading]);

  const handleApprove = async (targetUserId: string, name: string) => {
    setProcessing(targetUserId);
    try {
      await apiClient.post("/admin/approve-hod", { targetUserId });
      alert("Privileges transferred successfully.");
      await handleSignOut(); // Force sign out because they are no longer an HOD
      router.push("/");
    } catch (error: any) {
      alert(error.response?.data?.error || "Failed to transfer privileges.");
      setProcessing(null);
    }
  };

  const handleReject = async (targetUserId: string, name: string) => {
    if (
      !window.confirm(
        `Are you sure you want to REJECT ${name}? Their account will be permanently DELETED from the system.`,
      )
    )
      return;

    setProcessing(targetUserId);
    try {
      await apiClient.post("/admin/reject-hod", { targetUserId });
      alert("Account deleted.");
      // Remove the deleted user from the UI
      setRequests((prev) => prev.filter((req) => req.id !== targetUserId));
    } catch (error: any) {
      alert(error.response?.data?.error || "Failed to delete account.");
    } finally {
      setProcessing(null);
    }
  };
  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">HOD Role Transfer Requests</h1>
        <Link
          href="/hod/home"
          className="text-gray-600 hover:text-gray-900 border px-4 py-2 rounded"
        >
          Back to Dashboard
        </Link>
      </div>

      {fetching ? (
        <div className="p-10 text-center text-gray-500 border rounded-lg bg-gray-50">
          Scanning for requests...
        </div>
      ) : requests.length === 0 ? (
        <div className="p-10 text-center text-gray-500 border rounded-lg bg-gray-50">
          No pending HOD transfer requests in your department.
        </div>
      ) : (
        <div className="grid gap-6">
          {requests.map((req) => (
            <div
              key={req.id}
              className="border border-red-200 bg-red-50 rounded-lg p-6 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4"
            >
              <div>
                <h3 className="text-lg font-bold text-red-900">
                  {req.fullname}
                </h3>
                <p className="text-red-700">{req.email}</p>
                <p className="text-sm text-red-600 mt-2 font-medium">
                  This user is requesting to take over as Head of Department.
                </p>
              </div>

              <div className="flex gap-3 w-full md:w-auto">
                <button
                  onClick={() => handleApprove(req.id, req.fullname)}
                  disabled={processing !== null}
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 disabled:opacity-50 transition w-full md:w-auto"
                >
                  {processing === req.id
                    ? "Processing..."
                    : "Approve & Transfer Power"}
                </button>
                <button
                  onClick={() => handleReject(req.id, req.fullname)}
                  disabled={processing !== null}
                  className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-900 disabled:opacity-50 transition w-full md:w-auto"
                >
                  Reject & Delete Account
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HodRequestsPage;

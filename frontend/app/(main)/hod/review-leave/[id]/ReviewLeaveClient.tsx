"use client";

import apiClient from "@/lib/axios";
import { HodLeaveRequest } from "@/utils/helper";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const ReviewLeaveClient = ({ leaveId }: { leaveId: string }) => {
  const router = useRouter();

  const [leave, setLeave] = useState<HodLeaveRequest | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [processing, setProcessing] = useState<boolean>(false);

  useEffect(() => {
    const fetchSingleLeave = async () => {
      try {
        const response = await apiClient.get(`/leaves/${leaveId}`);
        setLeave(response.data);
      } catch (error) {
        console.error("Failed to fetch leave details", error);
      } finally {
        setLoading(false);
      }
    };

    if (leaveId) fetchSingleLeave();
  }, [leaveId]);

  const handleUpdateStatus = async (newStatus: "approved" | "rejected") => {
    setProcessing(true);
    try {
      await apiClient.patch(`/leaves/${leaveId}/status`, {
        status: newStatus,
      });
      router.push("/hod/view-leaves");
    } catch (error) {
      alert("Failed to update status. Please try again.");
      setProcessing(false);
    }
  };

  if (!leave) {
    return (
      <div className="p-8 text-center text-red-500">
        Leave request not found.
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto mt-10 p-8 border rounded-lg shadow-sm">
      <h1 className="text-2xl font-bold mb-6">Review Leave Request</h1>

      <div className="space-y-4 mb-8">
        <div>
          <h3 className="text-sm font-semibold text-gray-500 uppercase">
            Lecturer Name
          </h3>
          <p className="text-lg">{leave.profiles?.fullname}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase">
              Start Date
            </h3>
            <p className="text-lg">
              {new Date(leave.start_date).toLocaleDateString()}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase">
              End Date
            </h3>
            <p className="text-lg">
              {new Date(leave.end_date).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-gray-500 uppercase">
            Reason for Leave
          </h3>
          <div className="p-4 bg-gray-50 rounded border mt-1 text-gray-800 whitespace-pre-wrap">
            {leave.reason}
          </div>
        </div>
      </div>

      {leave.status === "pending" ? (
        <div className="flex gap-4">
          <button
            onClick={() => handleUpdateStatus("approved")}
            disabled={processing}
            className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            {processing ? "Processing..." : "Approve Leave"}
          </button>
          <button
            onClick={() => handleUpdateStatus("rejected")}
            disabled={processing}
            className="flex-1 bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 disabled:opacity-50"
          >
            {processing ? "Processing..." : "Reject Leave"}
          </button>
        </div>
      ) : (
        <div
          className={`p-4 rounded-lg text-center font-medium ${leave.status === "approved" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
        >
          This request has already been {leave.status}.
        </div>
      )}

      <div className="mt-6 text-center">
        <button
          onClick={() => router.back()}
          className="text-gray-600 hover:underline"
        >
          Cancel and return to list
        </button>
      </div>
    </div>
  );
};

export default ReviewLeaveClient;

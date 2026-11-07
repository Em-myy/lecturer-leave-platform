"use client";

import { useAuth } from "@/context/AuthContext";
import apiClient from "@/lib/axios";
import { LeaveRequest } from "@/utils/helper";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import { useEffect, useState } from "react";

const ViewLeavesPage = () => {
  const { user, loading } = useAuth();
  const supabase = createClient();

  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
  const [fetchingLeaves, setFetchingLeaves] = useState<boolean>(true);

  useEffect(() => {
    const fetchLeaves = async () => {
      try {
        const response = await apiClient.get("/leaves");

        setLeaves(response.data);
      } catch (error) {
        console.error("Failed to fetch leaves", error);
      } finally {
        setFetchingLeaves(false);
      }
    };

    if (user && !loading) {
      fetchLeaves();
    }
  }, [user, loading]);

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">My Leave History</h1>
        <Link
          href="/lecturer/home"
          className="text-gray-600 hover:text-gray-900 border px-4 py-2 rounded"
        >
          Back to Dashboard
        </Link>
      </div>

      {fetchingLeaves ? (
        <div className="p-10 text-center text-gray-500 border rounded-lg bg-gray-50">
          Loading your leave history...
        </div>
      ) : leaves.length === 0 ? (
        <div className="p-10 text-center border rounded-lg bg-gray-50 text-gray-500">
          <p className="mb-4">You haven't requested any leaves yet.</p>
          <Link
            href="/lecturer/submit-leave"
            className="text-blue-600 underline"
          >
            Submit your first request
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden border rounded-lg shadow-sm">
          <table className="min-w-full bg-white text-sm text-left">
            <thead className="bg-gray-100 text-gray-700 uppercase font-medium">
              <tr>
                <th className="py-3 px-6 border-b">Applied On</th>
                <th className="py-3 px-6 border-b">Start Date</th>
                <th className="py-3 px-6 border-b">End Date</th>
                <th className="py-3 px-6 border-b w-1/3">Reason</th>
                <th className="py-3 px-6 border-b">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {leaves.map((leave) => (
                <tr key={leave.id} className="hover:bg-gray-50 transition">
                  <td className="py-3 px-6 text-gray-500">
                    {new Date(leave.created_at).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-6 font-medium">
                    {new Date(leave.start_date).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-6 font-medium">
                    {new Date(leave.end_date).toLocaleDateString()}
                  </td>
                  <td
                    className="py-3 px-6 text-gray-600 truncate max-w-xs"
                    title={leave.reason}
                  >
                    {leave.reason}
                  </td>
                  <td className="py-3 px-6">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                        leave.status === "approved"
                          ? "bg-green-100 text-green-700"
                          : leave.status === "rejected"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {leave.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ViewLeavesPage;

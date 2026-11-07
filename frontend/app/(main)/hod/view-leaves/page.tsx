"use client";

import { useAuth } from "@/context/AuthContext";
import apiClient from "@/lib/axios";
import { HodLeaveRequest } from "@/utils/helper";
import Link from "next/link";
import { useEffect, useState } from "react";

const HodViewLeavesPage = () => {
  const { loading } = useAuth();

  const [leaves, setLeaves] = useState<HodLeaveRequest[]>([]);
  const [fetching, setFetching] = useState<boolean>(true);

  useEffect(() => {
    const fetchLeaves = async () => {
      try {
        const response = await apiClient.get("/leaves/all-leaves");
        setLeaves(response.data);
      } catch (error) {
        console.error("Failed to fetch department leaves", error);
      } finally {
        setFetching(false);
      }
    };

    if (!loading) fetchLeaves();
  }, [loading]);
  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Department Leave Requests</h1>
        <Link
          href="/hod/home"
          className="text-gray-600 hover:text-gray-900 border px-4 py-2 rounded"
        >
          Back to Dashboard
        </Link>
      </div>

      {fetching ? (
        <div className="p-10 text-center text-gray-500 border rounded-lg bg-gray-50">
          Loading requests...
        </div>
      ) : leaves.length === 0 ? (
        <div className="p-10 text-center text-gray-500 border rounded-lg bg-gray-50">
          No leave requests found in your department.
        </div>
      ) : (
        <div className="overflow-hidden border rounded-lg shadow-sm">
          <table className="min-w-full bg-white text-sm text-left">
            <thead className="bg-gray-100 text-gray-700 uppercase font-medium">
              <tr>
                <th className="py-3 px-6 border-b">Lecturer</th>
                <th className="py-3 px-6 border-b">Dates</th>
                <th className="py-3 px-6 border-b">Status</th>
                <th className="py-3 px-6 border-b text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {leaves.map((leave) => (
                <tr key={leave.id} className="hover:bg-gray-50 transition">
                  <td className="py-3 px-6 font-medium">
                    {leave.profiles?.fullname || "Unknown Lecturer"}
                  </td>
                  <td className="py-3 px-6 text-gray-600">
                    {new Date(leave.start_date).toLocaleDateString()} -{" "}
                    {new Date(leave.end_date).toLocaleDateString()}
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
                  <td className="py-3 px-6 text-right">
                    {/* Link to the dynamic detail page passing the leave ID in the URL */}
                    <Link
                      href={`/hod/review-leave/${leave.id}`}
                      className="text-blue-600 hover:underline font-medium"
                    >
                      {leave.status === "pending"
                        ? "Review Request"
                        : "View Details"}
                    </Link>
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

export default HodViewLeavesPage;

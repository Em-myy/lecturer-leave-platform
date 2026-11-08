"use client";

import { useAuth } from "@/context/AuthContext";
import apiClient from "@/lib/axios";
import { HodLeaveRequest } from "@/utils/helper";
import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  ClipboardCheck,
  Clock,
  Eye,
  FileText,
  User,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const HodViewLeavesPage = () => {
  const { loading } = useAuth();

  const [leaves, setLeaves] = useState<HodLeaveRequest[]>([]);
  const [fetching, setFetching] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const fetchLeaves = async () => {
      try {
        const response = await apiClient.get("/hod/all-leaves");
        setLeaves(response.data);
      } catch (error: any) {
        setErrorMsg(
          error.response?.data?.error || "Failed to fetch department leaves.",
        );
      } finally {
        setFetching(false);
      }
    };

    if (!loading) fetchLeaves();
  }, [loading]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle2 className="w-4 h-4 mr-1.5" />;
      case "rejected":
        return <XCircle className="w-4 h-4 mr-1.5" />;
      default:
        return <Clock className="w-4 h-4 mr-1.5" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-50 text-green-700 border-green-200";
      case "rejected":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-amber-50 text-amber-700 border-amber-200";
    }
  };

  return (
    <div className="max-w-6xl mx-auto mt-8 animate-in fade-in duration-500">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 border-b border-slate-100 pb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 text-blue-700 rounded-xl flex items-center justify-center border border-blue-200">
              <ClipboardCheck className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                Department Leave Requests
              </h1>
              <p className="text-slate-500 text-sm mt-1">
                Review and manage faculty applications
              </p>
            </div>
          </div>
          <Link
            href="/hod/home"
            className="inline-flex items-center justify-center bg-white border border-slate-300 text-slate-700 px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors shadow-sm"
          >
            Back to Dashboard
          </Link>
        </div>

        {/* Error State */}
        {errorMsg && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3 text-red-700">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <p className="text-sm font-medium">{errorMsg}</p>
          </div>
        )}

        {/* Content Area */}
        {fetching ? (
          <div className="py-16 flex flex-col items-center justify-center text-slate-500">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-400 mb-4"></div>
            <p>Loading requests...</p>
          </div>
        ) : leaves.length === 0 && !errorMsg ? (
          <div className="py-16 flex flex-col items-center justify-center text-center bg-slate-50 rounded-xl border border-dashed border-slate-300">
            <div className="bg-white p-4 rounded-full shadow-sm mb-4">
              <FileText className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              No Leave Requests Found
            </h3>
            <p className="text-slate-500 max-w-sm">
              There are currently no leave requests from lecturers in your
              department.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-sm">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-4 px-6 whitespace-nowrap">Lecturer</th>
                  <th className="py-4 px-6 whitespace-nowrap">Dates</th>
                  <th className="py-4 px-6 whitespace-nowrap text-center">
                    Status
                  </th>
                  <th className="py-4 px-6 whitespace-nowrap text-right">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {leaves.map((leave) => (
                  <tr
                    key={leave.id}
                    className="hover:bg-slate-50/80 transition-colors group"
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center text-slate-900 font-medium whitespace-nowrap">
                        <User className="w-4 h-4 text-slate-400 mr-2" />
                        {leave.profiles?.fullname || "Unknown Lecturer"}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center text-slate-700 whitespace-nowrap">
                        <Calendar className="w-4 h-4 text-slate-400 mr-2" />
                        {new Date(leave.start_date).toLocaleDateString(
                          undefined,
                          { month: "short", day: "numeric" },
                        )}
                        <span className="text-slate-400 mx-1.5">-</span>
                        {new Date(leave.end_date).toLocaleDateString(
                          undefined,
                          { month: "short", day: "numeric" },
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span
                        className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold capitalize border ${getStatusColor(leave.status)}`}
                      >
                        {getStatusIcon(leave.status)}
                        {leave.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <Link
                        href={`/hod/review-leave/${leave.id}`}
                        className="inline-flex items-center justify-center gap-1.5 bg-white border border-slate-300 text-slate-700 px-3 py-1.5 rounded-lg hover:bg-slate-50 hover:text-blue-600 hover:border-blue-300 transition-colors text-sm font-medium shadow-sm whitespace-nowrap"
                      >
                        <Eye className="w-4 h-4" />
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
    </div>
  );
};

export default HodViewLeavesPage;

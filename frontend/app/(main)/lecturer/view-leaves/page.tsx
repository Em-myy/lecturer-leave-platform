"use client";

import { useAuth } from "@/context/AuthContext";
import apiClient from "@/lib/axios";
import { LeaveRequest } from "@/utils/helper";
import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  Clock,
  FileText,
  History,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const ViewLeavesPage = () => {
  const { user, loading } = useAuth();

  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
  const [fetchingLeaves, setFetchingLeaves] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const fetchLeaves = async () => {
      try {
        const response = await apiClient.get("/leaves");
        setLeaves(response.data);
      } catch (error: any) {
        setErrorMsg(
          error.response?.data?.error || "Failed to fetch leave history.",
        );
      } finally {
        setFetchingLeaves(false);
      }
    };

    if (user && !loading) {
      fetchLeaves();
    }
  }, [user, loading]);

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
            <div className="w-12 h-12 bg-slate-50 text-slate-700 rounded-xl flex items-center justify-center border border-slate-200">
              <History className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                Leave History
              </h1>
              <p className="text-slate-500 text-sm mt-1">
                Review your past and pending applications
              </p>
            </div>
          </div>
          <Link
            href="/lecturer/submit-leave"
            className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm"
          >
            New Request
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
        {fetchingLeaves ? (
          <div className="py-16 flex flex-col items-center justify-center text-slate-500">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-400 mb-4"></div>
            <p>Loading your history...</p>
          </div>
        ) : leaves.length === 0 && !errorMsg ? (
          <div className="py-16 flex flex-col items-center justify-center text-center bg-slate-50 rounded-xl border border-dashed border-slate-300">
            <div className="bg-white p-4 rounded-full shadow-sm mb-4">
              <FileText className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              No Records Found
            </h3>
            <p className="text-slate-500 max-w-sm mb-6">
              You haven't submitted any leave requests yet. When you do, they
              will appear here.
            </p>
            <Link
              href="/lecturer/submit-leave"
              className="text-blue-600 font-medium hover:text-blue-700 hover:underline"
            >
              Submit your first request &rarr;
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-sm">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-4 px-6 whitespace-nowrap">Applied On</th>
                  <th className="py-4 px-6 whitespace-nowrap">Duration</th>
                  <th className="py-4 px-6 w-1/3 min-w-62.5">Reason</th>
                  <th className="py-4 px-6 whitespace-nowrap text-right">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {leaves.map((leave) => (
                  <tr
                    key={leave.id}
                    className="hover:bg-slate-50/80 transition-colors group"
                  >
                    <td className="py-4 px-6 text-slate-500 whitespace-nowrap">
                      {new Date(leave.created_at).toLocaleDateString(
                        undefined,
                        {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        },
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center text-slate-900 font-medium whitespace-nowrap">
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
                    <td className="py-4 px-6">
                      <p
                        className="text-slate-600 line-clamp-2 leading-relaxed"
                        title={leave.reason}
                      >
                        {leave.reason}
                      </p>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <span
                        className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold capitalize border ${getStatusColor(leave.status)}`}
                      >
                        {getStatusIcon(leave.status)}
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
    </div>
  );
};

export default ViewLeavesPage;

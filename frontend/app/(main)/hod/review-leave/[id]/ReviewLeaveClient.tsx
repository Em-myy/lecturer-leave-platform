"use client";

import { useAuth } from "@/context/AuthContext";
import apiClient from "@/lib/axios";
import { HodLeaveRequest } from "@/utils/helper";
import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  ChevronLeft,
  FileSearch,
  FileText,
  User,
  XCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const ReviewLeaveClient = ({ leaveId }: { leaveId: string }) => {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [leave, setLeave] = useState<HodLeaveRequest | null>(null);
  const [fetchingLeave, setFetchingLeave] = useState<boolean>(true);
  const [processing, setProcessing] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const fetchSingleLeave = async () => {
      try {
        const response = await apiClient.get(`/hod/${leaveId}`);
        setLeave(response.data);
      } catch (error: any) {
        setErrorMsg(
          error.response?.data?.error ||
            "Failed to fetch leave request details.",
        );
      } finally {
        setFetchingLeave(false);
      }
    };

    if (leaveId && user && !loading) {
      fetchSingleLeave();
    }
  }, [leaveId, user, loading]);

  const handleUpdateStatus = async (newStatus: "approved" | "rejected") => {
    setProcessing(true);
    setErrorMsg(null);
    try {
      await apiClient.patch(`/hod/${leaveId}/status`, {
        status: newStatus,
      });
      router.push("/hod/view-leaves");
    } catch (error: any) {
      setErrorMsg(
        error.response?.data?.error ||
          "Failed to update status. Please try again.",
      );
      setProcessing(false);
    }
  };

  if (!leave && !errorMsg) {
    return (
      <div className="p-8 text-center mt-10 bg-red-50 border border-red-200 text-red-700 rounded-xl max-w-2xl mx-auto flex items-center justify-center gap-3">
        <AlertCircle className="w-5 h-5" />
        <p className="font-medium">
          Leave request not found or has been deleted.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto mt-8 animate-in fade-in duration-500">
      <button
        onClick={() => router.back()}
        className="flex items-center text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors mb-6 group"
      >
        <ChevronLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
        Back to Department Leaves
      </button>

      <div className="bg-white p-8 md:p-10 rounded-2xl shadow-sm border border-slate-200">
        {/* Header Section */}
        <div className="flex items-center gap-4 mb-8 border-b border-slate-100 pb-6">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center border border-blue-100">
            <FileSearch className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Review Application
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Leave Request ID: {leaveId.split("-")[0]}
            </p>
          </div>
        </div>

        {errorMsg && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3 text-red-700">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <p className="text-sm font-medium">{errorMsg}</p>
          </div>
        )}

        {/* Details Section */}
        {leave && (
          <div className="space-y-6 mb-10">
            <div className="bg-slate-50 p-5 rounded-xl border border-slate-100">
              <div className="flex items-center gap-3 mb-1">
                <User className="w-4 h-4 text-slate-400" />
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Lecturer Name
                </h3>
              </div>
              <p className="text-lg font-medium text-slate-900 ml-7">
                {leave.profiles?.fullname || "Unknown Faculty"}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-50 p-5 rounded-xl border border-slate-100">
                <div className="flex items-center gap-3 mb-1">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Start Date
                  </h3>
                </div>
                <p className="text-lg font-medium text-slate-900 ml-7">
                  {new Date(leave.start_date).toLocaleDateString(undefined, {
                    weekday: "short",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>

              <div className="bg-slate-50 p-5 rounded-xl border border-slate-100">
                <div className="flex items-center gap-3 mb-1">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    End Date
                  </h3>
                </div>
                <p className="text-lg font-medium text-slate-900 ml-7">
                  {new Date(leave.end_date).toLocaleDateString(undefined, {
                    weekday: "short",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>

            <div className="bg-slate-50 p-5 rounded-xl border border-slate-100">
              <div className="flex items-center gap-3 mb-3">
                <FileText className="w-4 h-4 text-slate-400" />
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Reason for Leave
                </h3>
              </div>
              <div className="ml-7 text-slate-700 whitespace-pre-wrap leading-relaxed">
                {leave.reason}
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        {leave?.status === "pending" ? (
          <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-slate-100">
            <button
              onClick={() => handleUpdateStatus("rejected")}
              disabled={processing}
              className="flex-1 flex items-center justify-center gap-2 bg-white border border-red-200 text-red-700 py-3 rounded-xl hover:bg-red-50 transition-colors font-medium disabled:opacity-50"
            >
              {processing ? (
                "Processing..."
              ) : (
                <>
                  <XCircle className="w-5 h-5" /> Reject Application
                </>
              )}
            </button>
            <button
              onClick={() => handleUpdateStatus("approved")}
              disabled={processing}
              className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white py-3 rounded-xl hover:bg-green-700 transition-colors font-medium shadow-sm disabled:opacity-50"
            >
              {processing ? (
                "Processing..."
              ) : (
                <>
                  <CheckCircle2 className="w-5 h-5" /> Approve Application
                </>
              )}
            </button>
          </div>
        ) : (
          leave && (
            <div
              className={`p-5 rounded-xl text-center font-medium border flex items-center justify-center gap-2 ${
                leave.status === "approved"
                  ? "bg-green-50 text-green-800 border-green-200"
                  : "bg-red-50 text-red-800 border-red-200"
              }`}
            >
              {leave.status === "approved" ? (
                <CheckCircle2 className="w-5 h-5" />
              ) : (
                <XCircle className="w-5 h-5" />
              )}
              This request has already been {leave.status}.
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default ReviewLeaveClient;

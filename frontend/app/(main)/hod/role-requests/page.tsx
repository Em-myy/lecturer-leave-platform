"use client";

import { useAuth } from "@/context/AuthContext";
import apiClient from "@/lib/axios";
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  ShieldAlert,
  User,
  XCircle,
} from "lucide-react";
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
  const [confirmApprove, setConfirmApprove] = useState<string | null>(null);
  const [confirmReject, setConfirmReject] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await apiClient.get("/hod/requests");
        setRequests(response.data);
      } catch (error: any) {
        setErrorMsg(
          error.response?.data?.error || "Failed to fetch role requests.",
        );
      } finally {
        setFetching(false);
      }
    };

    if (!loading) fetchRequests();
  }, [loading]);

  const handleApprove = async (targetUserId: string) => {
    setProcessing(targetUserId);
    setErrorMsg(null);
    try {
      await apiClient.post("/hod/approve-hod", { targetUserId });
      setSuccessMsg("Privileges transferred successfully. Signing you out...");

      setTimeout(async () => {
        await handleSignOut();
      }, 2500);
    } catch (error: any) {
      setErrorMsg(
        error.response?.data?.error || "Failed to transfer privileges.",
      );
      setProcessing(null);
      setConfirmApprove(null);
    }
  };

  const handleReject = async (targetUserId: string) => {
    setProcessing(targetUserId);
    setErrorMsg(null);

    setProcessing(targetUserId);
    try {
      await apiClient.post("/hod/reject-hod", { targetUserId });
      setSuccessMsg("Fraudulent account successfully deleted.");
      setRequests((prev) => prev.filter((req) => req.id !== targetUserId));

      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (error: any) {
      setErrorMsg(error.response?.data?.error || "Failed to delete account.");
    } finally {
      setProcessing(null);
      setConfirmReject(null);
    }
  };

  return (
    <div className="max-w-5xl mx-auto mt-8 animate-in fade-in duration-500">
      <div className="bg-white p-8 md:p-10 rounded-2xl shadow-sm border border-slate-200">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 border-b border-slate-100 pb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-red-50 text-red-600 rounded-xl flex items-center justify-center border border-red-100">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                Role Transfer Requests
              </h1>
              <p className="text-slate-500 text-sm mt-1">
                Manage administrative power transitions
              </p>
            </div>
          </div>
        </div>

        {/* Status Messages */}
        {errorMsg && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3 text-red-700">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <p className="text-sm font-medium">{errorMsg}</p>
          </div>
        )}
        {successMsg && (
          <div className="mb-8 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3 text-green-700">
            <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
            <p className="text-sm font-medium">{successMsg}</p>
          </div>
        )}

        {/* Content Area */}
        {fetching ? (
          <div className="py-16 flex flex-col items-center justify-center text-slate-500">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-400 mb-4"></div>
            <p>Scanning for role requests...</p>
          </div>
        ) : requests.length === 0 ? (
          <div className="py-16 flex flex-col items-center justify-center text-center bg-slate-50 rounded-xl border border-dashed border-slate-300">
            <div className="bg-white p-4 rounded-full shadow-sm mb-4">
              <ShieldAlert className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              No Pending Requests
            </h3>
            <p className="text-slate-500 max-w-sm">
              There are no pending HOD transfer requests in your department at
              this time.
            </p>
          </div>
        ) : (
          <div className="grid gap-6">
            {requests.map((req) => (
              <div
                key={req.id}
                className="border border-red-200 bg-red-50/50 rounded-xl p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <User className="w-4 h-4 text-red-500" />
                    <h3 className="text-lg font-bold text-red-900">
                      {req.fullname}
                    </h3>
                  </div>
                  <p className="text-red-700 text-sm mb-2">{req.email}</p>
                  <p className="text-sm text-red-800 bg-red-100 px-3 py-1.5 rounded-md inline-block font-medium border border-red-200">
                    Warning: This user is requesting to take over your HOD
                    account privileges.
                  </p>
                </div>

                <div className="flex flex-col gap-3 w-full md:w-auto">
                  {/* APPROVAL FLOW */}
                  {confirmApprove === req.id ? (
                    <div className="bg-red-100 p-4 rounded-lg border border-red-300 w-full max-w-sm">
                      <p className="text-red-900 text-xs font-bold mb-3 uppercase tracking-wide flex items-center gap-1.5">
                        <AlertTriangle className="w-4 h-4" /> Transfer Power?
                      </p>
                      <p className="text-red-800 text-sm mb-4">
                        This permanently transfers your HOD role to{" "}
                        {req.fullname}. You will be demoted and signed out.
                      </p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleApprove(req.id)}
                          disabled={processing !== null}
                          className="bg-red-600 text-white px-3 py-2 rounded-md hover:bg-red-700 text-sm font-medium flex-1 disabled:opacity-50"
                        >
                          {processing === req.id
                            ? "Processing..."
                            : "Yes, Transfer"}
                        </button>
                        <button
                          onClick={() => setConfirmApprove(null)}
                          disabled={processing !== null}
                          className="bg-white text-red-900 border border-red-300 px-3 py-2 rounded-md hover:bg-red-50 text-sm font-medium flex-1"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    confirmReject !== req.id && (
                      <button
                        onClick={() => setConfirmApprove(req.id)}
                        disabled={processing !== null}
                        className="bg-red-600 text-white px-5 py-2.5 rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors font-medium shadow-sm w-full md:w-auto flex justify-center items-center gap-2"
                      >
                        <CheckCircle2 className="w-4 h-4" /> Approve & Transfer
                      </button>
                    )
                  )}

                  {/* REJECTION FLOW */}
                  {confirmReject === req.id ? (
                    <div className="bg-slate-900 p-4 rounded-lg border border-slate-700 w-full max-w-sm">
                      <p className="text-slate-100 text-xs font-bold mb-3 uppercase tracking-wide flex items-center gap-1.5">
                        <AlertTriangle className="w-4 h-4 text-red-400" />{" "}
                        Delete Account?
                      </p>
                      <p className="text-slate-300 text-sm mb-4">
                        Are you sure? This will permanently delete{" "}
                        {req.fullname}'s account from the system.
                      </p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleReject(req.id)}
                          disabled={processing !== null}
                          className="bg-red-500 text-white px-3 py-2 rounded-md hover:bg-red-600 text-sm font-medium flex-1 disabled:opacity-50"
                        >
                          {processing === req.id
                            ? "Processing..."
                            : "Yes, Delete"}
                        </button>
                        <button
                          onClick={() => setConfirmReject(null)}
                          disabled={processing !== null}
                          className="bg-slate-700 text-slate-100 border border-slate-600 px-3 py-2 rounded-md hover:bg-slate-600 text-sm font-medium flex-1"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    confirmApprove !== req.id && (
                      <button
                        onClick={() => setConfirmReject(req.id)}
                        disabled={processing !== null}
                        className="bg-slate-900 text-white px-5 py-2.5 rounded-lg hover:bg-slate-800 disabled:opacity-50 transition-colors font-medium shadow-sm w-full md:w-auto flex justify-center items-center gap-2"
                      >
                        <XCircle className="w-4 h-4" /> Reject & Delete
                      </button>
                    )
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HodRequestsPage;

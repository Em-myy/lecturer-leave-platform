"use client";

import { useAuth } from "@/context/AuthContext";
import apiClient from "@/lib/axios";
import { CheckCircle2, ShieldAlert, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const RequestHodPage = () => {
  const { department } = useAuth();
  const router = useRouter();

  const [submitting, setSubmitting] = useState<boolean>(false);
  const [hasConsented, setHasConsented] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleRequest = async () => {
    if (!hasConsented) return;

    setSubmitting(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      await apiClient.post("/request-hod");
      setSuccessMsg(
        "Request submitted successfully to the current HOD. Redirecting to dashboard...",
      );

      setTimeout(() => {
        router.push("/lecturer/home");
      }, 2000);
    } catch (error: any) {
      setErrorMsg(
        error.response?.data?.error ||
          "Failed to submit request. Please try again.",
      );
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-8 animate-in fade-in duration-500">
      <div className="bg-white p-8 md:p-10 rounded-2xl shadow-sm border border-slate-200">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8 border-b border-slate-100 pb-6">
          <div className="w-12 h-12 bg-red-50 text-red-600 rounded-xl flex items-center justify-center border border-red-100">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Elevate to Head of Department
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Administrative Role Transfer Request
            </p>
          </div>
        </div>

        {/* Status Messages */}
        {errorMsg && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3 text-red-700">
            <XCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <p className="text-sm font-medium">{errorMsg}</p>
          </div>
        )}

        {successMsg && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3 text-green-700">
            <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
            <p className="text-sm font-medium">{successMsg}</p>
          </div>
        )}

        {/* Strict Warning Box */}
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-red-500"></div>
          <h3 className="font-bold text-red-900 mb-3 text-lg flex items-center gap-2">
            STRICT ADMINISTRATIVE WARNING
          </h3>
          <p className="text-red-800 text-sm leading-relaxed mb-4">
            This action will submit a formal request to transfer Head of
            Department (HOD) privileges for the{" "}
            <strong className="font-bold bg-red-100 px-1 rounded">
              {department}
            </strong>{" "}
            department to this account.
          </p>
          <div className="bg-red-100/50 p-4 rounded-lg border border-red-200/50">
            <p className="text-red-900 text-sm font-semibold">
              If you request this role without being the newly appointed HOD,
              your account will be permanently deleted from the system.
            </p>
          </div>
        </div>

        {/* Consent Checkbox */}
        <label className="flex items-start gap-3 mb-6 cursor-pointer group">
          <div className="relative flex items-start mt-0.5">
            <input
              type="checkbox"
              className="peer w-5 h-5 border-slate-300 rounded text-red-600 focus:ring-red-600 transition-colors cursor-pointer"
              checked={hasConsented}
              onChange={(e) => setHasConsented(e.target.checked)}
              disabled={submitting || !!successMsg}
            />
          </div>
          <span className="text-sm text-slate-700 font-medium select-none group-hover:text-slate-900 transition-colors">
            I understand the consequences and confirm that I have been
            officially appointed as the Head of Department.
          </span>
        </label>

        {/* Action Button */}
        <button
          onClick={handleRequest}
          disabled={!hasConsented || submitting || !!successMsg}
          className="w-full flex justify-center items-center py-3.5 px-4 rounded-xl shadow-sm text-sm font-bold text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {submitting
            ? "Submitting Request..."
            : successMsg
              ? "Request Sent"
              : "I Accept the Risks - Request HOD Status"}
        </button>
      </div>
    </div>
  );
};

export default RequestHodPage;

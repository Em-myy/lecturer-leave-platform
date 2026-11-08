"use client";

import apiClient from "@/lib/axios";
import {
  AlertCircle,
  Calendar,
  FileText,
  PenLine,
  Send,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface FormType {
  startDate: string;
  endDate: string;
  reason: string;
}

const SubmitLeavePage = () => {
  const router = useRouter();

  const [formData, setFormData] = useState<FormType>({
    startDate: "",
    endDate: "",
    reason: "",
  });
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ): void => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
    setErrorMsg(null);
  };

  const handleSubmit = async (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (new Date(formData.endDate) < new Date(formData.startDate)) {
      setErrorMsg("End date cannot be earlier than the start date.");
      return;
    }

    setSubmitting(true);
    setErrorMsg(null);

    try {
      await apiClient.post("/leaves", formData);
      router.refresh();
      router.push("/lecturer/view-leaves");
    } catch (error: any) {
      setErrorMsg(
        error.response?.data?.error || "Failed to submit leave application.",
      );
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-8 animate-in fade-in duration-500">
      <div className="bg-white p-8 md:p-10 rounded-2xl shadow-sm border border-slate-200">
        {/* Header Section */}
        <div className="flex items-center gap-4 mb-8 border-b border-slate-100 pb-6">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center border border-blue-100">
            <PenLine className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Request Leave</h1>
            <p className="text-slate-500 text-sm mt-1">
              Submit a formal application to your Head of Department
            </p>
          </div>
        </div>

        {/* Error Banner */}
        {errorMsg && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3 text-red-700">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <p className="text-sm font-medium">{errorMsg}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Start Date */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Start Date
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  required
                  min={new Date().toISOString().split("T")[0]}
                  className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 sm:text-sm text-slate-900 bg-slate-50 focus:bg-white transition-colors outline-none cursor-pointer"
                />
              </div>
            </div>

            {/* End Date */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                End Date
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  required
                  min={
                    formData.startDate || new Date().toISOString().split("T")[0]
                  }
                  className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 sm:text-sm text-slate-900 bg-slate-50 focus:bg-white transition-colors outline-none cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Reason */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Reason for Leave
            </label>
            <div className="relative">
              <div className="absolute top-3 left-3 pointer-events-none">
                <FileText className="h-5 w-5 text-slate-400" />
              </div>
              <textarea
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                required
                rows={5}
                className="block w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 sm:text-sm text-slate-900 bg-slate-50 focus:bg-white transition-colors outline-none resize-none placeholder:text-slate-400"
                placeholder="Please detail your reason for this leave application..."
              />
            </div>
            <p className="mt-2 text-xs text-slate-500">
              Provide sufficient details for the HOD to review your request.
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col-reverse sm:flex-row gap-3 pt-6 border-t border-slate-100">
            <button
              type="button"
              onClick={() => router.back()}
              disabled={submitting}
              className="flex items-center justify-center gap-2 bg-white border border-slate-300 text-slate-700 px-6 py-2.5 rounded-lg hover:bg-slate-50 transition-colors sm:flex-1 font-medium disabled:opacity-50"
            >
              <X className="w-4 h-4" /> Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 transition-all sm:flex-2 font-medium shadow-sm disabled:opacity-50"
            >
              {submitting ? (
                "Submitting Application..."
              ) : (
                <>
                  <Send className="w-4 h-4" /> Submit Application
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubmitLeavePage;

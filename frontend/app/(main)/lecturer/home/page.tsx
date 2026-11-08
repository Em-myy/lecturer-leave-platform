"use client";

import { useAuth } from "@/context/AuthContext";
import { CalendarPlus, History } from "lucide-react";
import Link from "next/link";

const LecturerHomePage = () => {
  const { fullname, department, role } = useAuth();

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">{fullname}</h1>
          <p className="text-slate-500 mt-1 text-lg">{department} Department</p>
          <div className="mt-4 inline-flex items-center gap-2 bg-blue-50 text-blue-700 text-sm font-semibold px-3 py-1.5 rounded-full capitalize border border-blue-100">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500"></span>
            </span>
            {role}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Request Leave Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow group flex flex-col">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <CalendarPlus className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">
            Request Leave
          </h2>
          <p className="text-slate-500 mb-8 flex-1">
            Submit a new leave application to your Head of Department for review
            and approval.
          </p>
          <Link
            href="/lecturer/submit-leave"
            className="flex items-center justify-center gap-2 bg-slate-900 text-white px-6 py-2.5 rounded-lg hover:bg-slate-800 transition-colors w-full font-medium"
          >
            Create Request
          </Link>
        </div>

        {/* Leave History Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow group flex flex-col">
          <div className="w-12 h-12 bg-slate-50 text-slate-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform border border-slate-100">
            <History className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">
            Leave History
          </h2>
          <p className="text-slate-500 mb-8 flex-1">
            View the status of your pending requests and browse past leave
            applications.
          </p>
          <Link
            href="/lecturer/view-leaves"
            className="flex items-center justify-center gap-2 bg-white border border-slate-300 text-slate-700 px-6 py-2.5 rounded-lg hover:bg-slate-50 transition-colors w-full font-medium"
          >
            View History
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LecturerHomePage;

"use client";

import { useAuth } from "@/context/AuthContext";
import { ClipboardCheck, ShieldAlert } from "lucide-react";
import Link from "next/link";

const HodHomePage = () => {
  const { fullname, department } = useAuth();
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
            Head of Department
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Department Leaves Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow group flex flex-col">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <ClipboardCheck className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">
            Department Leaves
          </h2>
          <p className="text-slate-500 mb-8 flex-1">
            View and process pending leave requests from faculty members in your
            department.
          </p>
          <Link
            href="/hod/view-leaves"
            className="flex items-center justify-center gap-2 bg-slate-900 text-white px-6 py-2.5 rounded-lg hover:bg-slate-800 transition-colors w-full font-medium"
          >
            Review Requests
          </Link>
        </div>

        {/* Role Requests Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow group flex flex-col">
          <div className="w-12 h-12 bg-red-50 text-red-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform border border-red-100">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">
            Role Requests
          </h2>
          <p className="text-slate-500 mb-8 flex-1">
            Manage administrative transfer requests and approve newly appointed
            HODs.
          </p>
          <Link
            href="/hod/role-requests"
            className="flex items-center justify-center gap-2 bg-white border border-slate-300 text-slate-700 px-6 py-2.5 rounded-lg hover:bg-slate-50 transition-colors w-full font-medium"
          >
            Manage Roles
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HodHomePage;

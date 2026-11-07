"use client";

import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { useRouter } from "next/navigation";

const LecturerHomePage = () => {
  const { fullname, department, role, handleSignOut } = useAuth();

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-10 border-b pb-6">
        <div>
          <h1 className="text-3xl font-bold">{fullname}</h1>
          <p className="text-gray-600 mt-1">{department} Department</p>
          <span className="inline-block mt-2 bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded capitalize">
            {role}
          </span>
        </div>
        <button
          onClick={handleSignOut}
          className="bg-red-500 text-white px-5 py-2 rounded-lg hover:bg-red-600 transition"
        >
          Sign Out
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border rounded-xl p-6 shadow-sm hover:shadow-md transition">
          <h2 className="text-xl font-semibold mb-3">Request Leave</h2>
          <p className="text-gray-600 mb-6">
            Submit a new leave application to your Head of Department.
          </p>
          <Link
            href="/lecturer/submit-leave"
            className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 w-full text-center"
          >
            Create Request
          </Link>
        </div>

        <div className="border rounded-xl p-6 shadow-sm hover:shadow-md transition">
          <h2 className="text-xl font-semibold mb-3">Leave History</h2>
          <p className="text-gray-600 mb-6">
            View the status of your pending and past leave applications.
          </p>
          <Link
            href="/lecturer/view-leaves"
            className="inline-block bg-gray-100 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-200 border w-full text-center"
          >
            View Leaves
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LecturerHomePage;

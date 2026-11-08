"use client";

import { useAuth } from "@/context/AuthContext";
import {
  FileArchive,
  GraduationCap,
  Home,
  Key,
  ListCheck,
  LogOut,
  Menu,
  PenBox,
  ShieldCheck,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const Sidebar = () => {
  const { role, fullname, department, handleSignOut } = useAuth();
  const pathname = usePathname();

  const [isOpen, setIsOpen] = useState<boolean>(false);

  const lecturerLinks = [
    {
      name: "Dashboard",
      path: "/lecturer/home",
      icon: <Home className="w-5 h-5" />,
    },
    {
      name: "Request Leave",
      path: "/lecturer/submit-leave",
      icon: <PenBox className="w-5 h-5" />,
    },
    {
      name: "My Leaves",
      path: "/lecturer/view-leaves",
      icon: <ListCheck className="w-5 h-5" />,
    },
    {
      name: "Request HOD",
      path: "/lecturer/request-hod",
      icon: <ShieldCheck className="w-5 h-5" />,
    },
  ];

  const hodLinks = [
    {
      name: "Dashboard",
      path: "/hod/home",
      icon: <Home className="w-5 h-5" />,
    },
    {
      name: "Department Leaves",
      path: "/hod/view-leaves",
      icon: <FileArchive className="w-5 h-5" />,
    },
    {
      name: "Role Requests",
      path: "/hod/role-requests",
      icon: <Key className="w-5 h-5" />,
    },
  ];

  const links = role === "hod" ? hodLinks : lecturerLinks;

  if (!role) {
    return null;
  }
  return (
    <>
      {/* Mobile Menu Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-slate-900 text-white rounded-md shadow-md focus:outline-none hover:bg-slate-800 transition-colors"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-slate-900 bg-opacity-60 z-40 backdrop-blur-sm transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-slate-900 text-white transform transition-transform duration-300 ease-in-out flex flex-col shadow-2xl ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        {/* System Branding Header */}
        <div className="flex items-center gap-3 px-6 py-5 bg-slate-950 border-b border-slate-800">
          <div className="bg-slate-800 p-1.5 rounded-md">
            <GraduationCap className="w-5 h-5 text-blue-400" />
          </div>
          <span className="font-semibold tracking-wide text-slate-100">
            Leave Portal
          </span>
        </div>

        {/* User Info Section */}
        <div className="px-6 py-6 border-b border-slate-800 bg-slate-900/50">
          <h2 className="text-lg font-bold truncate text-white">{fullname}</h2>
          <p className="text-sm text-slate-400 truncate mt-0.5">
            {department} Dept
          </p>
          <span className="inline-block mt-3 bg-slate-800 border border-slate-700 text-xs px-2.5 py-1 rounded-full uppercase tracking-wider text-slate-300 font-medium">
            {role === "hod" ? "Head of Dept" : "Lecturer"}
          </span>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {links.map((link) => {
            const isActive = pathname === link.path;
            return (
              <Link
                key={link.name}
                href={link.path}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive
                    ? "bg-blue-600 text-white shadow-md shadow-blue-900/20 font-medium"
                    : "text-slate-400 hover:bg-slate-800 hover:text-slate-100"
                }`}
              >
                <span
                  className={`${isActive ? "text-white" : "text-slate-400"}`}
                >
                  {link.icon}
                </span>
                <span>{link.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Logout Section */}
        <div className="p-4 border-t border-slate-800 bg-slate-900">
          <button
            onClick={handleSignOut}
            className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-red-600 text-slate-300 hover:text-white px-4 py-2.5 rounded-lg transition-colors duration-200 font-medium border border-slate-700 hover:border-red-500"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;

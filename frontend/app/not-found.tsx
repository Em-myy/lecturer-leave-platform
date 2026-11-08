"use client";

import { FileQuestion } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NotFound = () => {
  const pathname = usePathname();

  // Determine the correct "home" path based on the user's current route
  const dashboardPath = pathname.startsWith("/hod")
    ? "/hod/home"
    : pathname.startsWith("/lecturer")
      ? "/lecturer/home"
      : "/";

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center gap-6 bg-slate-50 px-6 text-center font-sans">
      {/* Icon Badge */}
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-200 shadow-inner">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-300">
          <FileQuestion className="h-6 w-6 text-slate-600" />
        </div>
      </div>

      {/* Text Content */}
      <div className="max-w-md">
        <p className="font-semibold text-sm text-slate-500 uppercase tracking-widest">
          404 Error
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
          This page doesn&apos;t exist.
        </h1>
        <p className="mx-auto mt-3 text-base text-slate-600 leading-relaxed">
          The page you are looking for may have been moved, or the link might be
          broken.
        </p>
      </div>

      {/* Action Button */}
      <Link
        href={dashboardPath}
        className="mt-2 inline-flex items-center justify-center rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
      >
        Back to dashboard
      </Link>
    </div>
  );
};

export default NotFound;

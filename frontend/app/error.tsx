"use client";

import { AlertCircle } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

const Error = ({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) => {
  const pathname = usePathname();

  useEffect(() => {
    // This logs the error to an error reporting service if you have one
    console.error(error);
  }, [error]);

  // Determine the correct "home" path based on the user's current route
  const dashboardPath = pathname.startsWith("/hod")
    ? "/hod/home"
    : pathname.startsWith("/lecturer")
      ? "/lecturer/home"
      : "/";

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center gap-6 bg-slate-50 px-6 text-center">
      {/* Icon Badge */}
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100 shadow-inner">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-200">
          <AlertCircle className="h-6 w-6 text-red-600" />
        </div>
      </div>

      {/* Error Message Text */}
      <div className="max-w-md">
        <p className="font-semibold text-sm text-red-600 tracking-wide uppercase">
          System Error
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
          That request hit a snag.
        </h1>
        <p className="mx-auto mt-3 text-base text-slate-600 leading-relaxed">
          Try again, or head back to the dashboard. If this keeps happening,
          pass the reference code below to the IT department.
        </p>
        {error.digest && (
          <div className="mt-4 inline-block rounded-md bg-slate-200 px-3 py-1.5 text-xs font-mono text-slate-700 shadow-sm border border-slate-300">
            Ref: {error.digest}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="mt-2 flex flex-col sm:flex-row flex-wrap justify-center gap-3 w-full sm:w-auto">
        <button
          type="button"
          onClick={reset}
          className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 w-full sm:w-auto"
        >
          Try again
        </button>
        <Link
          href={dashboardPath}
          className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-6 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition-all hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 w-full sm:w-auto"
        >
          Go to dashboard
        </Link>
      </div>
    </div>
  );
};

export default Error;

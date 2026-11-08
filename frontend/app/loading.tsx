import { Loader2 } from "lucide-react";

const Loading = () => {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center gap-6 bg-slate-50 px-6 font-sans">
      {/* Spinning Icon Badge */}
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 shadow-inner animate-pulse motion-reduce:animate-none">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-200">
          <Loader2 className="h-6 w-6 animate-spin text-blue-600 motion-reduce:animate-none" />
        </div>
      </div>

      {/* Loading Text */}
      <p className="font-semibold text-sm uppercase tracking-widest text-slate-500 animate-pulse">
        Loading Workspace&hellip;
      </p>
    </div>
  );
};

export default Loading;

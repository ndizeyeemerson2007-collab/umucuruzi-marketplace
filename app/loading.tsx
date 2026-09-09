import { LoaderCircle } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex min-h-[45vh] items-center justify-center px-5 py-16" role="status" aria-live="polite">
      <div className="text-center">
        <LoaderCircle size={28} className="mx-auto animate-spin text-brand-500" />
        <p className="mt-3 text-sm font-medium text-brand-navy">Loading page...</p>
        <p className="mt-1 text-xs text-slate-400">Please wait a moment.</p>
      </div>
    </div>
  );
}

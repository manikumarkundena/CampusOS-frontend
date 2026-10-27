"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { AlertCircle, RefreshCw, Home } from "lucide-react";

export default function GlobalErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error cleanly
    console.error("CampusOS Application Error:", error);
  }, [error]);

  return (
    <div className="min-h-[calc(100vh-16rem)] flex items-center justify-center py-16 px-4 bg-campus-grid">
      <div className="glass-panel max-w-md w-full p-8 rounded-3xl border border-rose-200 text-center space-y-6 shadow-lg bg-white/90">
        <div className="w-14 h-14 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 mx-auto">
          <AlertCircle className="w-7 h-7" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold text-rose-600 uppercase tracking-widest bg-rose-50 px-3 py-1 rounded-full border border-rose-200">
            Runtime Exception
          </span>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Unexpected System State
          </h1>
          <p className="text-xs text-slate-500 leading-relaxed">
            {error.message || "An unexpected error occurred while communicating with services."}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={() => reset()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition-all"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Try Again</span>
          </button>
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold border border-slate-200 transition-all"
          >
            <Home className="w-4 h-4" />
            <span>Campus Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

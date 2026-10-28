import React from "react";
import Link from "next/link";
import { CampusBrand } from "@/components/layout/CampusBrand";
import { ArrowLeft, Home, Compass } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-16rem)] flex items-center justify-center py-16 px-4 bg-slate-50/60">
      <div className="glass-panel max-w-md w-full p-8 sm:p-10 rounded-3xl border border-slate-200 text-center space-y-6 shadow-lg">
        <div className="flex justify-center">
          <CampusBrand size="lg" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold text-blue-600 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
            404 Error
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Page Not Found
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
            The requested campus page, society profile, or event link does not exist or has been
            relocated.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition-all"
          >
            <Home className="w-4 h-4" />
            <span>Campus Home</span>
          </Link>
          <Link
            href="/events"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold border border-slate-200 shadow-xs transition-all"
          >
            <Compass className="w-4 h-4" />
            <span>Discover Events</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, UserPlus, LogIn, Sparkles, ShieldCheck } from "lucide-react";

export function CtaSection() {
  return (
    <section className="py-20 bg-slate-50/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl p-8 sm:p-14 bg-white border border-slate-200/90 shadow-sm overflow-hidden text-center space-y-6">
          {/* Subtle soft gradient background */}
          <div className="absolute inset-0 bg-radial-glow opacity-50 pointer-events-none" />

          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>Campus Platform</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Connect Your Campus Today
            </h2>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Explore university activities, streamline attendance, and manage student credentials
              through one unified institutional platform.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
              <Link
                href="/auth/register"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-md shadow-blue-500/20 transition-all hover:-translate-y-0.5"
              >
                <UserPlus className="w-4 h-4" />
                <span>Create Student Account</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/auth/login"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-semibold text-sm border border-slate-200 shadow-xs transition-all hover:border-slate-300 hover:-translate-y-0.5"
              >
                <LogIn className="w-4 h-4" />
                <span>Portal Sign In</span>
              </Link>
            </div>

            <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                Role-based access control
              </span>
              <span>•</span>
              <span>RESTful Spring Boot API</span>
              <span>•</span>
              <span>Public credential verification</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

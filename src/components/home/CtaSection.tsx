"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, UserPlus, LogIn, Sparkles, ShieldCheck, CheckCircle2 } from "lucide-react";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";

export function CtaSection() {
  return (
    <section className="py-24 bg-white border-t border-slate-200/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <RevealOnScroll>
          <div className="relative rounded-3xl p-10 sm:p-16 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 border border-slate-800 text-white shadow-2xl overflow-hidden text-center space-y-8">
            {/* Ambient Cyan/Cobalt Top Edge Glow */}
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[500px] h-[200px] bg-gradient-to-r from-blue-600/25 via-indigo-500/20 to-cyan-500/20 blur-3xl pointer-events-none" />

            <div className="relative z-10 max-w-3xl mx-auto space-y-5">
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-semibold backdrop-blur-xs">
                <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                <span>UNIFIED CAMPUS ARCHITECTURE</span>
              </div>

              <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight text-white">
                Bring Your Campus Into One Connected Experience
              </h2>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl mx-auto font-normal">
                Join students, society leaders, and faculty coordinators collaborating on event registrations,
                executive applications, and official digital credentialing.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
                <Link
                  href="/auth/register"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-semibold text-sm shadow-lg shadow-blue-500/25 transition-all hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-slate-900"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Create Student Account</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/auth/login"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 active:bg-white/20 text-white font-semibold text-sm border border-white/20 backdrop-blur-md transition-all hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-slate-900"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Portal Sign In</span>
                </Link>
              </div>

              <div className="pt-8 flex flex-wrap items-center justify-center gap-y-2 gap-x-6 text-xs text-slate-400 border-t border-white/10">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Role-based access control</span>
                </span>
                <span className="hidden sm:inline">•</span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
                  <span>Live RESTful API integration</span>
                </span>
                <span className="hidden sm:inline">•</span>
                <span>Open public verification</span>
              </div>
            </div>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}

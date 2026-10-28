"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ShieldCheck,
  Search,
  CheckCircle2,
  Lock,
  FileCheck,
  ArrowRight,
  ExternalLink,
} from "lucide-react";

export function CertificateTrustSection() {
  const router = useRouter();
  const [verificationCode, setVerificationCode] = useState("");

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!verificationCode.trim()) return;
    router.push(`/verify?code=${encodeURIComponent(verificationCode.trim())}`);
  };

  return (
    <section className="py-20 bg-white border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl p-8 sm:p-12 bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950 text-white relative overflow-hidden shadow-lg border border-slate-800">
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-semibold">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                <span>OFFICIAL CREDENTIAL VERIFICATION</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
                Online Credential Verification
              </h2>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl">
                Every certificate issued through CampusOS includes an official verification code
                and institutional record. Employers, graduate programs, and academic evaluators can
                verify certificate validity directly through the online verification portal.
              </p>

              {/* Instant Verification Search Bar */}
              <form onSubmit={handleVerify} className="max-w-lg pt-2">
                <label className="block text-xs font-medium text-slate-400 mb-2">
                  Verify a Certificate by Code or Identifier
                </label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Search className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value)}
                      placeholder="e.g. 550e8400-e29b-41d4-a716-446655440000"
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-800/90 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-mono text-xs"
                    />
                  </div>
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md transition-all shrink-0"
                  >
                    <span>Verify Now</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            </div>

            {/* Right Trust Column / Badges */}
            <div className="lg:col-span-5 space-y-4">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md space-y-1">
                <div className="flex items-center gap-2 text-xs font-bold text-white">
                  <Lock className="w-4 h-4 text-blue-400" />
                  <span>Public Instant Validation</span>
                </div>
                <p className="text-xs text-slate-400">
                  Open verification accessible to external evaluators without requiring an account.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md space-y-1">
                <div className="flex items-center gap-2 text-xs font-bold text-white">
                  <FileCheck className="w-4 h-4 text-indigo-400" />
                  <span>PDF Document Preview & Download</span>
                </div>
                <p className="text-xs text-slate-400">
                  Official PDF records generated with student name, event title, and verification code.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md space-y-1">
                <div className="flex items-center gap-2 text-xs font-bold text-white">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Real-Time Audit Records</span>
                </div>
                <p className="text-xs text-slate-400">
                  Direct connection to the backend certificate database for live validity status.
                </p>
              </div>

              <div className="pt-2 text-right">
                <Link
                  href="/verify"
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-400 hover:text-blue-300"
                >
                  <span>Open Full Verification Portal</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

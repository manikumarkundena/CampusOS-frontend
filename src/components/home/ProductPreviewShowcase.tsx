"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Calendar,
  Award,
  QrCode,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  Laptop,
  Clock,
  MapPin,
  Building,
} from "lucide-react";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";

export function ProductPreviewShowcase() {
  const [activeTab, setActiveTab] = useState<"event" | "certificate" | "attendance">("event");

  return (
    <section className="py-24 bg-slate-50/70 border-b border-slate-200/80 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
        {/* Section Header */}
        <RevealOnScroll className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-800 text-xs font-semibold">
            <Laptop className="w-3.5 h-3.5 text-cyan-600" />
            <span>INTERFACE EXPERIENCE</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Designed for Speed, Clarity, and Institutional Trust
          </h2>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
            Preview the actual interface workflows that power daily event discovery, QR attendance,
            and digital credentialing across campus.
          </p>
        </RevealOnScroll>

        {/* Interactive Experience Showcase */}
        <RevealOnScroll delay={100} className="max-w-4xl mx-auto">
          {/* Tab Switcher Controls */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
            <button
              onClick={() => setActiveTab("event")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === "event"
                  ? "bg-blue-600 text-white shadow-xs"
                  : "bg-white text-slate-600 hover:text-slate-900 border border-slate-200"
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Event RSVP & Discovery</span>
            </button>

            <button
              onClick={() => setActiveTab("certificate")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === "certificate"
                  ? "bg-blue-600 text-white shadow-xs"
                  : "bg-white text-slate-600 hover:text-slate-900 border border-slate-200"
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>Official Certificate Verification</span>
            </button>

            <button
              onClick={() => setActiveTab("attendance")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === "attendance"
                  ? "bg-blue-600 text-white shadow-xs"
                  : "bg-white text-slate-600 hover:text-slate-900 border border-slate-200"
              }`}
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>Dynamic QR Attendance</span>
            </button>
          </div>

          {/* Browser Window Wrapper */}
          <div className="rounded-3xl border border-slate-200/90 bg-white shadow-xl shadow-blue-900/5 overflow-hidden">
            {/* Window Chrome Header Bar */}
            <div className="px-5 py-3.5 bg-slate-100/80 border-b border-slate-200/80 flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-400/90 inline-block" />
                <span className="w-3 h-3 rounded-full bg-amber-400/90 inline-block" />
                <span className="w-3 h-3 rounded-full bg-emerald-400/90 inline-block" />
              </div>

              {/* URL Pill */}
              <div className="flex items-center gap-1.5 px-4 py-1 rounded-full bg-white border border-slate-200 text-[11px] font-mono text-slate-500 max-w-xs sm:max-w-md w-full justify-center shadow-2xs">
                <span className="text-emerald-600 font-bold">https://</span>
                <span>campusos.internal/dashboard/{activeTab}</span>
              </div>

              <div className="w-12 text-right">
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">PREVIEW</span>
              </div>
            </div>

            {/* Window Content Pane */}
            <div className="p-6 sm:p-10 bg-slate-50/50 min-h-[380px] flex items-center justify-center">
              {/* Tab 1: Event RSVP Discovery Preview */}
              {activeTab === "event" && (
                <div className="w-full max-w-lg bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                      Technical Hackathon
                    </span>
                    <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Registration Open
                    </span>
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-lg font-bold text-slate-900">
                      Campus Autonomous AI & Robotics Symposium
                    </h3>
                    <p className="text-xs text-slate-500">
                      Organized by Robotics and Artificial Intelligence Society
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs text-slate-600 pt-2 border-t border-slate-100">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>Tomorrow • 10:00 AM</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>Innovation Hall 402</span>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-between">
                    <span className="text-xs text-slate-500 font-medium">Capacity: 120 / 150 confirmed</span>
                    <Link
                      href="/events"
                      className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors"
                    >
                      Reserve Spot →
                    </Link>
                  </div>
                </div>
              )}

              {/* Tab 2: Certificate Preview */}
              {activeTab === "certificate" && (
                <div className="w-full max-w-lg bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                        OS
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900">Official Certificate of Achievement</p>
                        <p className="text-[10px] text-slate-400 font-mono">CAMPUS-REGISTRY-AUTH</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                      Active Record
                    </span>
                  </div>

                  <div className="text-center py-4 space-y-2 bg-slate-50/70 rounded-xl border border-slate-100">
                    <p className="text-[11px] text-slate-400 uppercase tracking-widest font-semibold">Awarded To</p>
                    <p className="text-lg font-extrabold text-slate-900 font-serif">Alex Mercer</p>
                    <p className="text-xs text-slate-600 px-4">
                      For verified participation and completion of the Autonomous AI Hackathon 2026.
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2 text-xs">
                    <div>
                      <p className="text-[10px] text-slate-400">Verification Code</p>
                      <p className="font-mono font-bold text-slate-800 text-[11px]">VERIF-2026-CAMPUS-9EDC</p>
                    </div>
                    <Link
                      href="/verify"
                      className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:underline"
                    >
                      <span>Public Lookup</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              )}

              {/* Tab 3: Dynamic QR Attendance Preview */}
              {activeTab === "attendance" && (
                <div className="w-full max-w-lg bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600">
                        <QrCode className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-bold text-xs text-slate-900">Dynamic Attendance Engine</h4>
                        <p className="text-[10px] text-slate-500">Live Time-Bound Token Session</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Token Active
                    </span>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2 text-center">
                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Dynamic Token Payload</p>
                    <p className="font-mono text-xs font-bold text-slate-800 bg-white px-3 py-2 rounded-lg border border-slate-200 break-all select-all">
                      SES-2026-QR-9EDC-446655-VALID
                    </p>
                    <p className="text-[11px] text-slate-500">Session validity: 45s remaining • Rotates automatically</p>
                  </div>

                  <div className="pt-2 flex items-center justify-between text-xs">
                    <span className="text-slate-500 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      Proxy-proof verification
                    </span>
                    <Link
                      href="/dashboard?tab=attendance"
                      className="font-semibold text-blue-600 hover:underline"
                    >
                      Open Student Check-In →
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}


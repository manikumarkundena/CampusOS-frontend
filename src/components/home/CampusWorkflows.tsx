"use client";

import React from "react";
import Link from "next/link";
import {
  Compass,
  QrCode,
  Award,
  ArrowRight,
  Workflow,
  CheckCircle2,
} from "lucide-react";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";

export function CampusWorkflows() {
  const steps = [
    {
      stepNumber: "01",
      title: "Discover & Connect",
      headline: "Explore Verified Campus Opportunities",
      description:
        "Browse university-wide events, chartered student societies, and open leadership recruitment drives through a single verified platform.",
      icon: Compass,
      accent: {
        number: "text-blue-600 bg-blue-50 border-blue-200",
        icon: "text-blue-600",
        border: "border-blue-200/80 hover:border-blue-300",
      },
      actionText: "Browse Events Feed",
      href: "/events",
      highlights: ["Official event calendar", "Student club directory", "Executive role applications"],
    },
    {
      stepNumber: "02",
      title: "Attend & Validate",
      headline: "Dynamic QR Attendance Check-In",
      description:
        "Confirm your presence during live events with time-bound dynamic session tokens. Anti-proxy mechanisms ensure verified attendance records.",
      icon: QrCode,
      accent: {
        number: "text-indigo-600 bg-indigo-50 border-indigo-200",
        icon: "text-indigo-600",
        border: "border-indigo-200/80 hover:border-indigo-300",
      },
      actionText: "Attendance Portal",
      href: "/dashboard?tab=attendance",
      highlights: ["Time-limited session tokens", "Proxy-proof check-ins", "Faculty coordinator audit logs"],
    },
    {
      stepNumber: "03",
      title: "Earn & Verify",
      headline: "Official Credential Registry",
      description:
        "Earn official digital certificates deposited directly into your student portfolio, with instant online verification codes for recruiters.",
      icon: Award,
      accent: {
        number: "text-cyan-700 bg-cyan-50 border-cyan-200",
        icon: "text-cyan-600",
        border: "border-cyan-200/80 hover:border-cyan-300",
      },
      actionText: "Verify Credentials",
      href: "/verify",
      highlights: ["Downloadable vector PDFs", "Public verification lookups", "Revocation audit records"],
    },
  ];

  return (
    <section className="py-24 bg-white border-b border-slate-200/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Section Header */}
        <RevealOnScroll className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold">
            <Workflow className="w-3.5 h-3.5 text-indigo-600" />
            <span>THE STUDENT JOURNEY</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
            How CampusOS Unifies Your University Experience
          </h2>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
            A three-step progression from discovering activities to validating verified student achievements.
          </p>
        </RevealOnScroll>

        {/* 3-Step Sequence Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <RevealOnScroll
                key={step.title}
                delay={idx * 150}
                className="h-full"
              >
                <div
                  className={`h-full bg-slate-50/70 hover:bg-white rounded-3xl p-8 border ${step.accent.border} shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col justify-between space-y-8 relative group`}
                >
                  <div className="space-y-6">
                    {/* Top Row: Number badge and Icon */}
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-xs font-bold font-mono px-3 py-1 rounded-xl border ${step.accent.number}`}
                      >
                        STEP {step.stepNumber}
                      </span>
                      <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 shadow-2xs flex items-center justify-center">
                        <Icon className={`w-5 h-5 ${step.accent.icon}`} />
                      </div>
                    </div>

                    {/* Step Title & Description */}
                    <div className="space-y-2">
                      <p className="text-xs font-semibold tracking-wider uppercase text-slate-400">
                        {step.title}
                      </p>
                      <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                        {step.headline}
                      </h3>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {step.description}
                      </p>
                    </div>

                    {/* Product Concept Highlights */}
                    <ul className="space-y-2 pt-2 border-t border-slate-200/60">
                      {step.highlights.map((item) => (
                        <li key={item} className="flex items-center gap-2 text-xs text-slate-600">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Action Link */}
                  <div className="pt-4 border-t border-slate-200/60">
                    <Link
                      href={step.href}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-900 group-hover:text-blue-600 transition-colors"
                    >
                      <span>{step.actionText}</span>
                      <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                    </Link>
                  </div>
                </div>
              </RevealOnScroll>
            );
          })}
        </div>
      </div>
    </section>
  );
}

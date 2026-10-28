"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  GraduationCap,
  ShieldAlert,
  CalendarCheck,
  Award,
  QrCode,
  Users,
  FileCheck2,
  CheckCircle,
  ArrowRight,
  Sparkles,
} from "lucide-react";

export function CampusWorkflows() {
  const [activePersona, setActivePersona] = useState<"student" | "admin">("student");

  const studentSteps = [
    {
      title: "Discover & RSVP to Events",
      description: "Browse verified campus activities across academic, cultural, and sports societies.",
      icon: CalendarCheck,
      action: "Browse Events",
      href: "/events",
    },
    {
      title: "Fast QR Check-in",
      description: "Scan or enter the dynamic session token during live events to confirm real presence.",
      icon: QrCode,
      action: "Check-in Portal",
      href: "/dashboard?tab=attendance",
    },
    {
      title: "Earn Official Certificates",
      description: "Receive verifiable PDF certificates directly to your student record after attending events.",
      icon: Award,
      action: "My Certificates",
      href: "/dashboard?tab=certificates",
    },
    {
      title: "Join Student Leadership",
      description: "Apply for club executive positions with structured SOPs and track interview statuses.",
      icon: Users,
      action: "Recruitment Drives",
      href: "/recruitment",
    },
  ];

  const adminSteps = [
    {
      title: "Design Certificate Templates",
      description: "Upload backgrounds, configure field coordinates, fonts, and verification QR placements.",
      icon: FileCheck2,
      action: "Certificate Studio",
      href: "/dashboard?tab=certificate-studio",
    },
    {
      title: "Live Dynamic Attendance",
      description: "Launch time-bound cryptographic QR check-in sessions with proxy-proof verification.",
      icon: QrCode,
      action: "Launch Session",
      href: "/dashboard?tab=attendance",
    },
    {
      title: "Bulk Certificate Issuance",
      description: "Preview eligible attendees, skip duplicates, and batch-issue with email delivery status.",
      icon: Award,
      action: "Bulk Issue",
      href: "/dashboard?tab=certificate-studio",
    },
    {
      title: "Faculty Approval Governance",
      description: "Audit pending event submissions, request capacity adjustments, or approve schedules.",
      icon: ShieldAlert,
      action: "Review Queue",
      href: "/dashboard?tab=approvals",
    },
  ];

  const activeSteps = activePersona === "student" ? studentSteps : adminSteps;

  return (
    <section className="py-20 bg-slate-50/70 border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Unified University Workflows</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            How CampusOS Powers Your University
          </h2>

          <p className="text-sm sm:text-base text-slate-600">
            Tailored journeys for attendees and organizers built on an auditable, role-based infrastructure.
          </p>

          {/* Persona Switcher Toggle */}
          <div className="inline-flex p-1 rounded-2xl bg-white border border-slate-200 shadow-xs">
            <button
              onClick={() => setActivePersona("student")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activePersona === "student"
                  ? "bg-blue-600 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>For Students & Attendees</span>
            </button>

            <button
              onClick={() => setActivePersona("admin")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activePersona === "admin"
                  ? "bg-blue-600 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <ShieldAlert className="w-4 h-4" />
              <span>For Faculty & Club Admins</span>
            </button>
          </div>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {activeSteps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={step.title}
                className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm hover:border-blue-300 hover:shadow-md transition-all flex flex-col justify-between space-y-4 relative group"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-bold font-mono text-slate-400">
                      0{idx + 1}
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <h3 className="font-bold text-base text-slate-900">{step.title}</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100">
                  <Link
                    href={step.href}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    <span>{step.action}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}


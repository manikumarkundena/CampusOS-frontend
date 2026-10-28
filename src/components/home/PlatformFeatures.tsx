"use client";

import React from "react";
import Link from "next/link";
import {
  Calendar,
  Users,
  Briefcase,
  Award,
  ArrowRight,
  Layers,
} from "lucide-react";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";

export function PlatformFeatures() {
  const capabilities = [
    {
      title: "Campus Events",
      category: "CALENDAR & SESSIONS",
      description:
        "Discover academic workshops, student hackathons, and symposiums across departments with real-time RSVP confirmations.",
      icon: Calendar,
      href: "/events",
      actionText: "Explore Events Calendar",
      accent: {
        pill: "bg-blue-50 text-blue-700 border-blue-200",
        iconBg: "bg-blue-600/10 text-blue-600 border-blue-500/20",
        borderHover: "hover:border-blue-300 hover:shadow-blue-500/5",
        ctaText: "text-blue-600 hover:text-blue-700",
      },
    },
    {
      title: "Clubs & Communities",
      category: "STUDENT SOCIETIES",
      description:
        "Connect with recognized engineering chapters, arts collectives, and interest groups operating under verified faculty guidance.",
      icon: Users,
      href: "/clubs",
      actionText: "Browse Student Guilds",
      accent: {
        pill: "bg-indigo-50 text-indigo-700 border-indigo-200",
        iconBg: "bg-indigo-600/10 text-indigo-600 border-indigo-500/20",
        borderHover: "hover:border-indigo-300 hover:shadow-indigo-500/5",
        ctaText: "text-indigo-600 hover:text-indigo-700",
      },
    },
    {
      title: "Recruitment Pipeline",
      category: "EXECUTIVE PIPELINE",
      description:
        "Apply for student leadership positions with structured statements of purpose, milestone updates, and interview coordination.",
      icon: Briefcase,
      href: "/recruitment",
      actionText: "View Open Positions",
      accent: {
        pill: "bg-violet-50 text-violet-700 border-violet-200",
        iconBg: "bg-violet-600/10 text-violet-600 border-violet-500/20",
        borderHover: "hover:border-violet-300 hover:shadow-violet-500/5",
        ctaText: "text-violet-600 hover:text-violet-700",
      },
    },
    {
      title: "Digital Certificates",
      category: "CREDENTIAL REGISTRY",
      description:
        "Earn official event credentials stored in your university record and verified publicly via open cryptographic lookup codes.",
      icon: Award,
      href: "/verify",
      actionText: "Verify a Credential",
      accent: {
        pill: "bg-cyan-50 text-cyan-800 border-cyan-200",
        iconBg: "bg-cyan-600/10 text-cyan-700 border-cyan-500/20",
        borderHover: "hover:border-cyan-300 hover:shadow-cyan-500/5",
        ctaText: "text-cyan-700 hover:text-cyan-800",
      },
    },
  ];

  return (
    <section className="py-24 bg-slate-50/70 border-b border-slate-200/80 relative overflow-hidden">
      {/* Background Dimensional Ambient Glow */}
      <div className="absolute inset-0 bg-radial-glow opacity-50 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-16">
        {/* Section Header */}
        <RevealOnScroll className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold">
            <Layers className="w-3.5 h-3.5 text-blue-600" />
            <span>CORE PLATFORM CAPABILITIES</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Architected for the Entire University Ecosystem
          </h2>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
            From event discovery to faculty-supervised credentials, CampusOS brings campus life
            into a secure, auditable, and beautifully unified operating system.
          </p>
        </RevealOnScroll>

        {/* Coordinated 4-Card Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {capabilities.map((item, index) => {
            const Icon = item.icon;
            return (
              <RevealOnScroll
                key={item.title}
                delay={index * 100}
                className="h-full"
              >
                <div
                  className={`h-full bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/90 shadow-xs transition-all duration-300 flex flex-col justify-between space-y-6 interactive-card ${item.accent.borderHover}`}
                >
                  <div className="space-y-5">
                    {/* Header: Icon & Category Tag */}
                    <div className="flex items-center justify-between">
                      <div
                        className={`w-12 h-12 rounded-xl border flex items-center justify-center transition-transform duration-300 group-hover:scale-105 ${item.accent.iconBg}`}
                      >
                        <Icon className="w-6 h-6" />
                      </div>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border tracking-wide uppercase ${item.accent.pill}`}
                      >
                        {item.category}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="space-y-2">
                      <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                        {item.title}
                      </h3>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  {/* Footer Action */}
                  <div className="pt-4 border-t border-slate-100">
                    <Link
                      href={item.href}
                      className={`inline-flex items-center gap-1.5 text-xs font-semibold group ${item.accent.ctaText}`}
                    >
                      <span>{item.actionText}</span>
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

"use client";

import React from "react";
import Link from "next/link";
import {
  Compass,
  ArrowRight,
  ShieldCheck,
  Calendar,
  Users,
  Briefcase,
  Award,
  Sparkles,
} from "lucide-react";
import { RotatingHeadline } from "./RotatingHeadline";

export function HeroSection() {
  const features = [
    {
      title: "Campus Events",
      description: "Discover workshops, hackathons, and sessions published across departments.",
      icon: Calendar,
      href: "/events",
      accent: "text-blue-600 bg-blue-50 border-blue-100",
    },
    {
      title: "Clubs & Communities",
      description: "Connect with verified student societies, technical guilds, and student groups.",
      icon: Users,
      href: "/clubs",
      accent: "text-indigo-600 bg-indigo-50 border-indigo-100",
    },
    {
      title: "Recruitment Opportunities",
      description: "Apply for club executive roles and committee positions with structured applications.",
      icon: Briefcase,
      href: "/recruitment",
      accent: "text-violet-600 bg-violet-50 border-violet-100",
    },
    {
      title: "Digital Certificates",
      description: "Earn official event credentials and verify authenticity through open lookup codes.",
      icon: Award,
      href: "/verify",
      accent: "text-sky-600 bg-sky-50 border-sky-100",
    },
  ];

  return (
    <section className="relative overflow-hidden bg-white border-b border-slate-200/80">
      {/* Soft, calm radial background lighting without graph-paper grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(circle at 50% 18%, rgba(239, 246, 255, 0.7) 0%, rgba(255, 255, 255, 1) 75%)",
        }}
      />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-28 flex flex-col items-center justify-center text-center">
        {/* Eyebrow Announcement */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-xs font-semibold mb-6 shadow-2xs">
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          <span>THE CONNECTED CAMPUS PLATFORM</span>
        </div>

        {/* Centered Headline with Rotating Final Phrase */}
        <div className="max-w-4xl mx-auto">
          <RotatingHeadline />
        </div>

        {/* Supporting Copy */}
        <p className="mt-6 text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto font-normal">
          Discover campus events, connect with clubs, manage opportunities, and verify digital credentials through one unified platform.
        </p>

        {/* Prominent Action Group */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 w-full sm:w-auto">
          <Link
            href="/events"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold shadow-sm transition-all hover:-translate-y-0.5"
          >
            <Compass className="w-4 h-4" />
            <span>Explore Campus</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            href="/auth/register"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 text-sm font-semibold border border-slate-200 shadow-2xs transition-all hover:border-slate-300 hover:-translate-y-0.5"
          >
            <span>Get Started</span>
          </Link>

          <Link
            href="/verify"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-3.5 rounded-xl text-slate-600 hover:text-blue-600 text-sm font-medium transition-colors"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Verify Certificate</span>
          </Link>
        </div>

        {/* Four Restrained Product Feature Summaries Without Illustrations */}
        <div className="mt-16 sm:mt-20 pt-10 border-t border-slate-200/80 w-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 text-left">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <Link
                  key={feature.title}
                  href={feature.href}
                  className="group p-5 rounded-2xl bg-white hover:bg-slate-50/80 border border-slate-200/90 shadow-2xs hover:border-blue-200 hover:shadow-xs transition-all flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-3">
                    <div className={`w-9 h-9 rounded-xl border flex items-center justify-center ${feature.accent}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="space-y-1">
                      <h2 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                        {feature.title}
                      </h2>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center gap-1 text-xs font-semibold text-blue-600 opacity-80 group-hover:opacity-100">
                    <span>Explore</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

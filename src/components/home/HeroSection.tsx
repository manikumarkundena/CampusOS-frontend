"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Compass,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  QrCode,
  Award,
  Lock,
} from "lucide-react";
import { RotatingHeadline } from "./RotatingHeadline";

export function HeroSection() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className="relative overflow-hidden bg-white border-b border-slate-200/80 min-h-[calc(100vh-4rem)] flex flex-col justify-center">
      {/* 1. Multi-Layered Atmospheric Lighting */}
      <div className="absolute inset-0 bg-hero-glow pointer-events-none" />

      {/* 2. 3D Perspective Grid Background (Fades naturally into the horizon) */}
      <div className="hero-grid-perspective">
        <div
          className="hero-grid-plane"
          style={{
            transform: `rotateX(68deg) translateY(${Math.min(scrollY * 0.12, 30)}px)`,
          }}
        />
      </div>

      {/* 3. Horizon Ambient Illumination */}
      <div className="hero-horizon-glow" />

      {/* 4. Hero Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-32 flex flex-col items-center justify-center text-center">
        {/* Eyebrow Label with Shimmer Aura */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50/90 border border-blue-200/90 text-blue-700 text-xs font-semibold mb-6 shadow-xs backdrop-blur-xs">
          <Sparkles className="w-3.5 h-3.5 text-blue-600 animate-pulse" />
          <span className="tracking-wide">THE CONNECTED CAMPUS PLATFORM</span>
        </div>

        {/* Dynamic Editorial Headline with Smooth Phrase Rotation */}
        <div className="max-w-4xl mx-auto">
          <RotatingHeadline />
        </div>

        {/* Supporting Copy with Balanced Reading Width */}
        <p className="mt-6 text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto font-normal">
          Discover campus events, connect with clubs, manage opportunities, and verify digital credentials through one unified platform.
        </p>

        {/* Prominent Action Group */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 w-full sm:w-auto">
          <Link
            href="/events"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-sm font-semibold shadow-md shadow-blue-500/20 transition-all hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <Compass className="w-4 h-4" />
            <span>Explore Campus</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            href="/auth/register"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 active:bg-slate-100 text-slate-800 text-sm font-semibold border border-slate-200 shadow-xs transition-all hover:border-slate-300 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
          >
            <span>Get Started</span>
          </Link>

          <Link
            href="/verify"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-3.5 rounded-xl text-slate-600 hover:text-blue-600 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/30 rounded-xl"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Verify Certificate</span>
          </Link>
        </div>

        {/* Small Refined Product-Oriented Visual Capsule */}
        <div className="mt-12 sm:mt-16 inline-flex flex-wrap items-center justify-center gap-y-2 gap-x-6 px-5 py-2.5 rounded-2xl bg-white/80 border border-slate-200/90 shadow-xs backdrop-blur-md text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-semibold text-slate-800">Unified Architecture</span>
          </div>
          <span className="hidden sm:inline text-slate-300">•</span>
          <div className="flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5 text-blue-600" />
            <span>Official Digital Credentials</span>
          </div>
          <span className="hidden sm:inline text-slate-300">•</span>
          <div className="flex items-center gap-1.5">
            <QrCode className="w-3.5 h-3.5 text-indigo-600" />
            <span>Dynamic QR Attendance</span>
          </div>
          <span className="hidden sm:inline text-slate-300">•</span>
          <div className="flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-cyan-600" />
            <span>Role-Based Governance</span>
          </div>
        </div>
      </div>
    </section>
  );
}

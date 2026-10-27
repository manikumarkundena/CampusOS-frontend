import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Sparkles, Calendar, ArrowRight, ShieldCheck, QrCode, Search } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-8 pb-16 lg:pt-14 lg:pb-24 bg-campus-grid">
      {/* Background radial glow */}
      <div className="absolute inset-0 bg-radial-glow pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Headline and CTAs */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Pill Announcement */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50/90 border border-blue-200/80 text-blue-700 text-xs font-semibold shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-blue-600 animate-pulse" />
              <span>Next-Generation Intelligent Campus Operating System</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.12]">
              Your campus. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600">
                One connected experience.
              </span>
            </h1>

            {/* Supporting Copy */}
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto lg:mx-0">
              Discover verified campus events, join student clubs, track cryptographic attendance,
              and manage your university journey on a single unified platform.
            </p>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
              <Link
                href="/events"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-md shadow-blue-500/20 transition-all hover:-translate-y-0.5"
              >
                <Calendar className="w-4 h-4" />
                <span>Explore Events</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/clubs"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-medium border border-slate-200 shadow-xs transition-all hover:border-slate-300 hover:-translate-y-0.5"
              >
                <span>Browse Student Clubs</span>
              </Link>
              <Link
                href="/verify"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-3.5 rounded-xl text-slate-600 hover:text-blue-600 text-sm font-medium transition-colors"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Verify Certificate</span>
              </Link>
            </div>

            {/* Institutional Trust Highlights */}
            <div className="pt-6 border-t border-slate-200/80 grid grid-cols-3 gap-4 max-w-xl mx-auto lg:mx-0 text-left">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                  <ShieldCheck className="w-4 h-4 text-blue-600" />
                  <span>Tamper-Proof</span>
                </div>
                <p className="text-[11px] text-slate-500">Verified digital credentialing</p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                  <QrCode className="w-4 h-4 text-indigo-600" />
                  <span>QR Attendance</span>
                </div>
                <p className="text-[11px] text-slate-500">Dynamic session verification</p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                  <Sparkles className="w-4 h-4 text-violet-600" />
                  <span>Role-Based</span>
                </div>
                <p className="text-[11px] text-slate-500">Faculty & club administration</p>
              </div>
            </div>
          </div>

          {/* Right Column: Original Generated Architectural Campus Visual (Asset A) */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-lg lg:max-w-none rounded-3xl p-2 bg-gradient-to-b from-blue-200/50 via-indigo-100/30 to-purple-100/50 shadow-xl shadow-blue-500/10 border border-white/80">
              <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-slate-100">
                <Image
                  src="/images/campus-hero.jpg"
                  alt="Futuristic university campus with crystalline glass towers and pedestrian bridges over a tranquil lake at twilight"
                  fill
                  priority
                  className="object-cover object-center transition-transform duration-700 hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                {/* Subtle soft gradient overlay to guarantee light tone harmony */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/30 via-transparent to-transparent pointer-events-none" />

                {/* Floating pill over image */}
                <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-md rounded-xl p-3 border border-white/60 shadow-lg flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <div>
                      <p className="font-semibold text-slate-900">Campus Innovation Complex</p>
                      <p className="text-[10px] text-slate-500">Intelligent venue & hub integration</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                    Live Campus
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

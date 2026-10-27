import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, UserPlus, LogIn, Sparkles } from "lucide-react";

export function CtaSection() {
  return (
    <section className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden shadow-xl border border-slate-200">
          <div className="relative h-80 sm:h-96 w-full">
            <Image
              src="/images/campus-showcase.jpg"
              alt="Futuristic university auditorium and symposium center"
              fill
              className="object-cover object-center"
              sizes="(max-width: 1200px) 100vw, 1200px"
            />
            {/* Atmospheric overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-900/70 to-slate-900/40 flex items-center">
              <div className="max-w-2xl p-6 sm:p-12 text-white space-y-5">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 backdrop-blur-md border border-blue-400/30 text-blue-200 text-xs font-semibold">
                  <Sparkles className="w-3.5 h-3.5 text-blue-300" />
                  <span>Student & Faculty Portal</span>
                </div>

                <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
                  Ready to transform how your campus connects?
                </h2>

                <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                  Join hundreds of students and organizers discovering workshops, managing club
                  recruitment, and earning official cryptographic credentials.
                </p>

                <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                  <Link
                    href="/auth/register"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-md shadow-blue-500/20 transition-all"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Register Account</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  <Link
                    href="/auth/login"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-sm border border-white/20 backdrop-blur-md transition-all"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>Student Sign In</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

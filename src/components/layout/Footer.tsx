"use client";

import React from "react";
import Link from "next/link";
import { CampusBrand } from "./CampusBrand";
import { Shield, Sparkles, Activity, Award, ExternalLink } from "lucide-react";
import { API_SERVER_ORIGIN } from "@/lib/api-client";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white text-slate-600 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Column 1: Brand & Identity */}
          <div className="space-y-4 md:col-span-1">
            <CampusBrand size="md" />
            <p className="text-xs text-slate-500 leading-relaxed">
              ONE CAMPUS. ONE PLATFORM. An intelligent, connected operating system for university
              events, student clubs, verified credentials, and campus life.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live Spring Boot API
              </span>
            </div>
          </div>

          {/* Column 2: Platform Discovery */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Discovery
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/events" className="hover:text-blue-600 transition-colors">
                  Campus Events
                </Link>
              </li>
              <li>
                <Link href="/events/calendar" className="hover:text-blue-600 transition-colors">
                  Interactive Calendar
                </Link>
              </li>
              <li>
                <Link href="/clubs" className="hover:text-blue-600 transition-colors">
                  Student Clubs & Societies
                </Link>
              </li>
              <li>
                <Link href="/recruitment" className="hover:text-blue-600 transition-colors">
                  Recruitment Drives
                </Link>
              </li>
              <li>
                <Link href="/campus-voice" className="hover:text-blue-600 transition-colors">
                  Campus Voice Community
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Trust & Governance */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Verification & Tools
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link
                  href="/verify"
                  className="inline-flex items-center gap-1 hover:text-blue-600 transition-colors"
                >
                  <Award className="w-3.5 h-3.5 text-blue-600" />
                  <span>Verify Certificate</span>
                </Link>
              </li>
              <li>
                <Link href="/auth/login" className="hover:text-blue-600 transition-colors">
                  Student & Staff Portal
                </Link>
              </li>
              <li>
                <Link href="/auth/register" className="hover:text-blue-600 transition-colors">
                  New Student Registration
                </Link>
              </li>
              <li>
                <a
                  href={`${API_SERVER_ORIGIN}/swagger-ui.html`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 hover:text-blue-600 transition-colors"
                >
                  <span>Backend OpenAPI Docs</span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Architecture & Security */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              System Architecture
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Equipped with cryptographically verified attendance check-ins, faculty review queues,
              and immutable audit logs for university compliance.
            </p>
            <div className="pt-1 flex items-center gap-2 text-xs text-slate-500">
              <Shield className="w-4 h-4 text-slate-400" />
              <span>Role-based RBAC Authorization</span>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© 2026 CampusOS Platform. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-blue-500" />
              <span>Next.js App Router & Tailwind CSS</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Activity className="w-3.5 h-3.5 text-emerald-500" />
              <span>Spring Boot 3.x Backend</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

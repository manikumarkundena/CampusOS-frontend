"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ClubItem } from "@/types/api";
import { api } from "@/lib/api-client";
import { ClubCard } from "@/components/clubs/ClubCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { Users, ArrowRight, Sparkles, Building2 } from "lucide-react";

export function CommunitiesPreview() {
  const [clubs, setClubs] = useState<ClubItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.clubs
      .search({ page: 0, size: 4 })
      .then((res) => {
        setClubs(res?.data?.content || []);
      })
      .catch(() => {
        setClubs([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <section className="py-20 bg-slate-50/60 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Banner with Asset B (Campus Innovation Hub & Commons) */}
        <div className="relative rounded-3xl overflow-hidden mb-16 border border-slate-200/80 shadow-md">
          <div className="relative h-72 sm:h-80 lg:h-96 w-full">
            <Image
              src="/images/campus-community.jpg"
              alt="Futuristic university innovation hub and student commons atrium"
              fill
              className="object-cover object-center"
              sizes="(max-width: 1200px) 100vw, 1200px"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-900/60 to-transparent flex items-center">
              <div className="max-w-xl p-6 sm:p-10 text-white space-y-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 backdrop-blur-md border border-blue-400/30 text-blue-200 text-xs font-semibold">
                  <Sparkles className="w-3.5 h-3.5 text-blue-300" />
                  <span>Student Communities & Guilds</span>
                </div>
                <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
                  Where collegiate passions become extraordinary achievements.
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Join recognized technical guilds, arts collectives, research circles, and
                  sports chapters under official university faculty supervision.
                </p>
                <div className="pt-2">
                  <Link
                    href="/clubs"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold transition-all shadow-md shadow-blue-600/30"
                  >
                    <span>Browse All Societies</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-blue-600 uppercase tracking-wider">
              <Users className="w-4 h-4" />
              <span>Campus Directory</span>
            </div>
            <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Featured Student Clubs & Societies
            </h3>
          </div>
          <Link
            href="/clubs"
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1"
          >
            <span>View all directory</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Clubs Grid or Genuine Empty State */}
        {loading ? (
          <div className="py-8 text-center text-xs text-slate-400">Loading student clubs...</div>
        ) : clubs.length === 0 ? (
          <EmptyState
            icon={Building2}
            title="Club Directory Initializing"
            description="No student clubs are currently listed. Super administrators can establish new verified clubs and appoint faculty coordinators."
            actionLabel="View Campus Voice"
            actionHref="/campus-voice"
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {clubs.map((club) => (
              <ClubCard key={club.id} club={club} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

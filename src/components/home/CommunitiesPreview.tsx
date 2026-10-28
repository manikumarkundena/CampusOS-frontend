"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ClubItem } from "@/types/api";
import { api } from "@/lib/api-client";
import { ClubCard } from "@/components/clubs/ClubCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { Users, ArrowRight, Building2 } from "lucide-react";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";

export function CommunitiesPreview() {
  const [clubs, setClubs] = useState<ClubItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    api.clubs
      .search({ page: 0, size: 4 })
      .then((res) => {
        if (mounted) {
          setClubs(res?.data?.content || []);
        }
      })
      .catch(() => {
        if (mounted) {
          setClubs([]);
        }
      })
      .finally(() => {
        if (mounted) {
          setLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section className="py-20 bg-slate-50/60 border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Section Header */}
        <RevealOnScroll className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-blue-600 uppercase tracking-wider">
              <Users className="w-4 h-4" />
              <span>Campus Directory</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Student Clubs & Societies
            </h2>
            <p className="text-sm text-slate-500">
              Browse verified student organizations, technical chapters, and student committees.
            </p>
          </div>
          <Link
            href="/clubs"
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1 self-start sm:self-auto"
          >
            <span>View all directory</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </RevealOnScroll>

        {/* Clubs Grid or Honest Empty State */}
        {loading ? (
          <div className="py-12 text-center text-xs text-slate-400">Loading student clubs...</div>
        ) : clubs.length === 0 ? (
          <EmptyState
            icon={Building2}
            title="Club Directory Initializing"
            description="No student clubs are currently listed in the registry."
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

"use client";

import React, { useEffect, useState, use, Suspense } from "react";
import Link from "next/link";
import { ClubItem, ClubMember, RecruitmentDrive } from "@/types/api";
import { api } from "@/lib/api-client";
import { formatDate } from "@/lib/utils";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import {
  Users,
  ShieldCheck,
  Briefcase,
  ArrowLeft,
  Calendar,
  AlertCircle,
  ExternalLink,
  UserCheck,
} from "lucide-react";

function ClubDetailContent({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;

  const [club, setClub] = useState<ClubItem | null>(null);
  const [members, setMembers] = useState<ClubMember[]>([]);
  const [drives, setDrives] = useState<RecruitmentDrive[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadClubData = async () => {
      setLoading(true);
      setError(null);
      try {
        const clubRes = await api.clubs.getBySlug(slug);
        if (clubRes?.data) {
          const clubData = clubRes.data;
          setClub(clubData);

          // Fetch members & drives concurrently
          try {
            const [membersRes, drivesRes] = await Promise.allSettled([
              api.clubs.getMembers(clubData.id, 0, 20),
              api.recruitment.getDrivesForClub(clubData.id, 0, 10),
            ]);

            if (membersRes.status === "fulfilled" && membersRes.value?.data) {
              setMembers(membersRes.value.data.content || []);
            }
            if (drivesRes.status === "fulfilled" && drivesRes.value?.data) {
              setDrives(drivesRes.value.data.content || []);
            }
          } catch {
            // Secondary endpoints are non-blocking
          }
        } else {
          setError("Club not found");
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Failed to load club details";
        setError(msg);
      } finally {
        setLoading(false);
      }
    };

    loadClubData();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen py-24 flex items-center justify-center">
        <LoadingSpinner label="Loading club profile..." />
      </div>
    );
  }

  if (error || !club) {
    return (
      <div className="min-h-screen py-24 flex items-center justify-center px-4">
        <div className="glass-panel max-w-md p-8 rounded-2xl text-center space-y-4 border border-rose-200">
          <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
          <h2 className="text-lg font-bold text-slate-800">Club Unavailable</h2>
          <p className="text-xs text-slate-500">{error || "This society does not exist."}</p>
          <Link
            href="/clubs"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-lg"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Clubs Directory</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-10 bg-slate-50/60">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Navigation Breadcrumb */}
        <div>
          <Link
            href="/clubs"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to all clubs</span>
          </Link>
        </div>

        {/* Club Banner & Header Card */}
        <div className="glass-panel rounded-3xl overflow-hidden border border-slate-200 shadow-md">
          {/* Banner */}
          <div className="h-44 sm:h-56 w-full bg-gradient-to-tr from-blue-700 via-indigo-700 to-violet-800 relative">
            {club.bannerUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={club.bannerUrl} alt={club.name} className="w-full h-full object-cover" />
            ) : (
              <div className="absolute inset-0 bg-slate-100 opacity-60 pointer-events-none" />
            )}
          </div>

          {/* Profile bar */}
          <div className="p-6 sm:p-8 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                    {club.category || "Student Guild"}
                  </span>
                  {club.active && (
                    <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                      Active Chapter
                    </span>
                  )}
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  {club.name}
                </h1>
              </div>

              <div className="flex items-center gap-3 text-xs">
                <Link
                  href={`/events?clubId=${club.id}`}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-colors shadow-xs"
                >
                  Hosted Events
                </Link>
              </div>
            </div>

            {/* Meta bar */}
            <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center gap-6 text-xs text-slate-600">
              <div className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-blue-600" />
                <span className="font-semibold text-slate-800">{club.memberCount ?? 0}</span>
                <span>registered members</span>
              </div>

              {club.facultyCoordinatorName && (
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-indigo-600" />
                  <span>Faculty Coordinator:</span>
                  <span className="font-semibold text-slate-800">
                    {club.facultyCoordinatorName}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content Tabs / Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Description & Recruitment (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-200 space-y-4">
              <h2 className="text-base font-bold text-slate-900">About the Society</h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                {club.description || "No official society overview provided."}
              </p>
            </div>

            {/* Active Recruitment Drives */}
            <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-200 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-blue-600" />
                  <h3 className="font-bold text-base text-slate-900">Recruitment Drives</h3>
                </div>
                <Link
                  href="/recruitment"
                  className="text-xs text-blue-600 font-semibold hover:underline"
                >
                  All Campus Drives →
                </Link>
              </div>

              {drives.length === 0 ? (
                <p className="text-xs text-slate-400 py-3">
                  No active recruitment drives open at this moment.
                </p>
              ) : (
                <div className="space-y-3">
                  {drives.map((drive) => (
                    <div
                      key={drive.id}
                      className="p-4 rounded-xl border border-slate-200 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold uppercase text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            {drive.status}
                          </span>
                          <span className="text-xs text-slate-400">AY {drive.academicYear}</span>
                        </div>
                        <h4 className="font-bold text-sm text-slate-900">{drive.title}</h4>
                        <p className="text-xs text-slate-500">
                          Window: {formatDate(drive.startDate)} – {formatDate(drive.endDate)}
                        </p>
                      </div>

                      <Link
                        href={`/recruitment?driveId=${drive.id}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
                      >
                        <span>View Positions</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Member Roster (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="glass-panel p-6 rounded-2xl border border-slate-200 space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <UserCheck className="w-4 h-4 text-blue-600" />
                <h3 className="font-bold text-sm text-slate-900">Executive & Members</h3>
              </div>

              {members.length === 0 ? (
                <p className="text-xs text-slate-400 py-3">
                  Membership records are maintained privately by club administrators.
                </p>
              ) : (
                <div className="space-y-2.5">
                  {members.map((m) => (
                    <div
                      key={m.id}
                      className="p-2.5 rounded-lg border border-slate-100 bg-slate-50 flex items-center justify-between text-xs"
                    >
                      <div>
                        <p className="font-semibold text-slate-800">{m.userFullName}</p>
                        <p className="text-[10px] text-slate-400">{m.roleInClub || "Member"}</p>
                      </div>
                      {m.clubAdmin && (
                        <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
                          Lead
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ClubDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen py-24 flex items-center justify-center">
          <LoadingSpinner label="Loading club profile..." />
        </div>
      }
    >
      <ClubDetailContent params={params} />
    </Suspense>
  );
}

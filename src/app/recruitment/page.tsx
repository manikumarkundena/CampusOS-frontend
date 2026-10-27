"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { RecruitmentDrive, RecruitmentPosition } from "@/types/api";
import { api } from "@/lib/api-client";
import { useAuth } from "@/lib/auth-context";
import { formatDate } from "@/lib/utils";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { EmptyState } from "@/components/ui/EmptyState";
import {
  Briefcase,
  Users,
  Calendar,
  Send,
  CheckCircle2,
  AlertCircle,
  X,
  FileText,
  Building,
} from "lucide-react";

export default function RecruitmentPage() {
  const { user, isAuthenticated } = useAuth();

  const [drives, setDrives] = useState<RecruitmentDrive[]>([]);
  const [loading, setLoading] = useState(true);
  const [positionsMap, setPositionsMap] = useState<Record<string, RecruitmentPosition[]>>({});
  const [expandedDriveId, setExpandedDriveId] = useState<string | null>(null);

  // Application Modal
  const [selectedPosition, setSelectedPosition] = useState<RecruitmentPosition | null>(null);
  const [sop, setSop] = useState("");
  const [resumeUrl, setResumeUrl] = useState("");
  const [applying, setApplying] = useState(false);
  const [applySuccess, setApplySuccess] = useState(false);
  const [applyError, setApplyError] = useState<string | null>(null);

  useEffect(() => {
    api.recruitment
      .getOpenDrives(0, 20)
      .then((res) => {
        const list = res?.data?.content || [];
        setDrives(list);
        if (list.length > 0) {
          loadPositionsForDrive(list[0].id);
        }
      })
      .catch(() => {
        setDrives([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const loadPositionsForDrive = async (driveId: string) => {
    setExpandedDriveId(driveId);
    if (!positionsMap[driveId]) {
      try {
        const res = await api.recruitment.getPositionsForDrive(driveId);
        setPositionsMap((prev) => ({ ...prev, [driveId]: res?.data || [] }));
      } catch {
        // silent
      }
    }
  };

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPosition || !isAuthenticated) return;

    setApplying(true);
    setApplyError(null);

    try {
      await api.recruitment.submitApplication({
        positionId: selectedPosition.id,
        statementOfPurpose: sop,
        resumeUrl: resumeUrl.trim() || undefined,
      });
      setApplySuccess(true);
      setTimeout(() => {
        setSelectedPosition(null);
        setSop("");
        setResumeUrl("");
        setApplySuccess(false);
      }, 2000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to submit application";
      setApplyError(msg);
    } finally {
      setApplying(false);
    }
  };

  return (
    <div className="min-h-screen py-10 bg-slate-50/60">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200/80 pb-6">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 uppercase tracking-wider">
              <Briefcase className="w-4 h-4" />
              <span>Executive Recruitment</span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Open Recruitment Drives
            </h1>
            <p className="text-sm text-slate-500">
              Apply for core team, technical leads, and organizing committee positions in university clubs.
            </p>
          </div>

          {isAuthenticated && (
            <Link
              href="/dashboard?tab=applications"
              className="text-xs font-semibold text-blue-600 hover:underline"
            >
              My Submitted Applications →
            </Link>
          )}
        </div>

        {/* Drives List */}
        {loading ? (
          <div className="py-20">
            <LoadingSpinner label="Loading open recruitment drives..." />
          </div>
        ) : drives.length === 0 ? (
          <EmptyState
            icon={Briefcase}
            title="No Recruitment Drives Currently Active"
            description="Student organizations publish seasonal recruitment drives during semester onboarding. Check back soon or explore campus clubs directly."
            actionLabel="Discover Student Clubs"
            actionHref="/clubs"
          />
        ) : (
          <div className="space-y-6">
            {drives.map((drive) => {
              const isExpanded = expandedDriveId === drive.id;
              const positions = positionsMap[drive.id] || [];

              return (
                <div
                  key={drive.id}
                  className="glass-panel rounded-2xl border border-slate-200/80 p-6 space-y-4 shadow-xs"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          {drive.status}
                        </span>
                        <span className="text-xs text-slate-400">AY {drive.academicYear}</span>
                      </div>
                      <h3 className="text-lg font-bold text-slate-900">{drive.title}</h3>
                      <p className="text-xs text-blue-600 font-semibold">{drive.clubName}</p>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>
                        {formatDate(drive.startDate)} – {formatDate(drive.endDate)}
                      </span>
                    </div>
                  </div>

                  {drive.description && (
                    <p className="text-xs text-slate-600 leading-relaxed">{drive.description}</p>
                  )}

                  {/* Toggle Positions */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <button
                      onClick={() =>
                        isExpanded ? setExpandedDriveId(null) : loadPositionsForDrive(drive.id)
                      }
                      className="text-xs font-semibold text-blue-600 hover:text-blue-700"
                    >
                      {isExpanded ? "Hide Open Positions" : "View Open Positions"}
                    </button>
                  </div>

                  {/* Positions List */}
                  {isExpanded && (
                    <div className="pt-3 space-y-3">
                      <h4 className="text-xs font-bold text-slate-700">Open Roles</h4>
                      {positions.length === 0 ? (
                        <p className="text-xs text-slate-400 py-2">
                          No specific roles listed for this drive.
                        </p>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {positions.map((pos) => (
                            <div
                              key={pos.id}
                              className="p-4 rounded-xl border border-slate-200 bg-white space-y-2.5 flex flex-col justify-between"
                            >
                              <div className="space-y-1">
                                <div className="flex items-center justify-between">
                                  <h5 className="font-bold text-sm text-slate-900">{pos.title}</h5>
                                  {pos.openings && (
                                    <span className="text-[10px] text-slate-500 font-medium bg-slate-100 px-2 py-0.5 rounded">
                                      {pos.openings} opening{pos.openings > 1 ? "s" : ""}
                                    </span>
                                  )}
                                </div>
                                {pos.description && (
                                  <p className="text-xs text-slate-500 line-clamp-2">
                                    {pos.description}
                                  </p>
                                )}
                                {pos.requirements && (
                                  <p className="text-[11px] text-slate-400 italic">
                                    Req: {pos.requirements}
                                  </p>
                                )}
                              </div>

                              <div className="pt-2">
                                {isAuthenticated ? (
                                  <button
                                    onClick={() => setSelectedPosition(pos)}
                                    className="w-full py-1.5 px-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors"
                                  >
                                    Apply For Position
                                  </button>
                                ) : (
                                  <Link
                                    href="/auth/login"
                                    className="block text-center w-full py-1.5 px-3 rounded-lg border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50"
                                  >
                                    Sign In to Apply
                                  </Link>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Modal: Submit Application */}
        {selectedPosition && (
          <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 border border-slate-200 shadow-2xl relative">
              <button
                onClick={() => setSelectedPosition(null)}
                className="absolute top-5 right-5 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  {selectedPosition.clubName}
                </span>
                <h3 className="text-lg font-bold text-slate-900">
                  Apply for {selectedPosition.title}
                </h3>
              </div>

              {applySuccess ? (
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start gap-2.5 text-xs text-emerald-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    Your application has been submitted to the club reviewers successfully!
                  </span>
                </div>
              ) : (
                <form onSubmit={handleApply} className="space-y-4">
                  {applyError && (
                    <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800">
                      {applyError}
                    </div>
                  )}

                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-slate-700">
                      Statement of Purpose (SOP) <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      required
                      rows={5}
                      value={sop}
                      onChange={(e) => setSop(e.target.value)}
                      placeholder="Explain your relevant experience, motivation, and how you will contribute to this society..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-slate-700">
                      Portfolio or Resume Link (Optional)
                    </label>
                    <input
                      type="url"
                      value={resumeUrl}
                      onChange={(e) => setResumeUrl(e.target.value)}
                      placeholder="https://github.com/... or Google Drive URL"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={applying}
                    className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-all disabled:opacity-50"
                  >
                    {applying ? "Submitting Candidate Application..." : "Submit Application"}
                  </button>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

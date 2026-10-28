"use client";

import React, { useEffect, useState, useCallback, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import {
  Registration,
  Certificate,
  RecruitmentApplication,
  RecommendationItem,
  NotificationItem,
  EventItem,
  CampusAnalytics,
  RoleAccessRequest,
  AttendanceSession,
} from "@/types/api";
import { api } from "@/lib/api-client";
import { formatDate, formatTime, getRegistrationStatusBadge, getRoleBadge } from "@/lib/utils";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { EmptyState } from "@/components/ui/EmptyState";
import { ClubAdminCertificateManager } from "@/components/certificates/ClubAdminCertificateManager";
import {
  Calendar,
  Award,
  Briefcase,
  Bell,
  Sparkles,
  QrCode,
  CheckCircle2,
  Download,
  PlusCircle,
  ShieldAlert,
  BarChart3,
  ExternalLink,
  AlertCircle,
  Users,
  Eye,
  X,
} from "lucide-react";

function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab") || "registrations";

  const { user, isAuthenticated, loading: authLoading, canManageEvents, isFaculty, isSuperAdmin } = useAuth();

  const [activeTab, setActiveTab] = useState(initialTab);

  // Student State
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [applications, setApplications] = useState<RecruitmentApplication[]>([]);
  const [recommendations, setRecommendations] = useState<RecommendationItem[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [dataLoading, setDataLoading] = useState(false);

  // Admin / Faculty State
  const [pendingApprovals, setPendingApprovals] = useState<EventItem[]>([]);
  const [campusAnalytics, setCampusAnalytics] = useState<CampusAnalytics | null>(null);
  const [roleRequests, setRoleRequests] = useState<RoleAccessRequest[]>([]);

  // Attendance QR Session Creation State
  const [qrEventId, setQrEventId] = useState("");
  const [qrDuration, setQrDuration] = useState(60);
  const [createdSession, setCreatedSession] = useState<AttendanceSession | null>(null);
  const [sessionError, setSessionError] = useState<string | null>(null);
  const [creatingSession, setCreatingSession] = useState(false);

  // Student QR Check-in State
  const [checkInToken, setCheckInToken] = useState("");
  const [checkInStatus, setCheckInStatus] = useState<string | null>(null);
  const [checkingIn, setCheckingIn] = useState(false);

  // Student Certificate Download & Preview State
  const [downloadingCertId, setDownloadingCertId] = useState<string | null>(null);
  const [previewCertBlobUrl, setPreviewCertBlobUrl] = useState<string | null>(null);
  const [previewCertTitle, setPreviewCertTitle] = useState<string | null>(null);

  const handleDownloadCertificate = async (cert: Certificate) => {
    setDownloadingCertId(cert.id);
    try {
      const blob = await api.certificates.downloadPdfBlob(cert.id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `CampusOS_Certificate_${cert.certificateNumber || cert.verificationCode || cert.id}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to download certificate PDF");
    } finally {
      setDownloadingCertId(null);
    }
  };

  const handlePreviewCertificate = async (cert: Certificate) => {
    setPreviewCertTitle(cert.eventTitle || cert.certificateNumber || "Certificate");
    try {
      const blob = await api.certificates.downloadPdfBlob(cert.id);
      const url = window.URL.createObjectURL(blob);
      setPreviewCertBlobUrl(url);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to load certificate preview");
      setPreviewCertBlobUrl(null);
    }
  };

  const handleCloseCertPreview = () => {
    if (previewCertBlobUrl) {
      window.URL.revokeObjectURL(previewCertBlobUrl);
    }
    setPreviewCertBlobUrl(null);
    setPreviewCertTitle(null);
  };

  // Redirect to login if not authenticated after auth loading finishes
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/auth/login?redirect=/dashboard");
    }
  }, [authLoading, isAuthenticated, router]);

  const loadTabData = useCallback(async (tab: string) => {
    setDataLoading(true);
    try {
      if (tab === "registrations") {
        const res = await api.registrations.getMyRegistrations(0, 20);
        setRegistrations(res?.data?.content || []);
      } else if (tab === "certificates") {
        const res = await api.certificates.getMyCertificates(0, 20);
        setCertificates(res?.data?.content || []);
      } else if (tab === "applications") {
        const res = await api.recruitment.getMyApplications(0, 20);
        setApplications(res?.data?.content || []);
      } else if (tab === "recommendations") {
        const res = await api.recommendations.get(8);
        setRecommendations(res?.data || []);
      } else if (tab === "notifications") {
        const res = await api.notifications.getMyNotifications(0, 20);
        setNotifications(res?.data?.content || []);
      } else if (tab === "approvals" && (isFaculty || isSuperAdmin)) {
        const res = await api.events.getPendingApprovals(0, 20);
        setPendingApprovals(res?.data?.content || []);
      } else if (tab === "analytics" && isSuperAdmin) {
        const res = await api.analytics.getCampusAnalytics();
        setCampusAnalytics(res?.data || null);
      } else if (tab === "roles" && isSuperAdmin) {
        const res = await api.accessRequests.getAllRequests(undefined, 0, 20);
        setRoleRequests(res?.data?.content || []);
      }
    } catch {
      // Non-blocking fallback
    } finally {
      setDataLoading(false);
    }
  }, [isFaculty, isSuperAdmin]);

  useEffect(() => {
    if (isAuthenticated) {
      queueMicrotask(() => {
        loadTabData(activeTab);
      });
    }
  }, [isAuthenticated, activeTab, loadTabData]);

  const handleStartQrSession = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!qrEventId.trim()) return;

    setCreatingSession(true);
    setSessionError(null);
    try {
      const res = await api.attendance.startSession(qrEventId.trim(), Number(qrDuration));
      setCreatedSession(res?.data || null);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to generate attendance session";
      setSessionError(msg);
    } finally {
      setCreatingSession(false);
    }
  };

  const handleStudentCheckIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkInToken.trim()) return;

    setCheckingIn(true);
    setCheckInStatus(null);
    try {
      const res = await api.attendance.checkIn(checkInToken.trim());
      if (res?.data) {
        setCheckInStatus("Attendance verified successfully! Your presence has been recorded.");
        setCheckInToken("");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Invalid or expired check-in token";
      setCheckInStatus(`Error: ${msg}`);
    } finally {
      setCheckingIn(false);
    }
  };

  const handleReviewEvent = async (id: string, decision: "APPROVE" | "REJECT" | "REQUEST_CHANGES", comment?: string) => {
    try {
      await api.events.review(id, { decision, comment });
      loadTabData("approvals");
    } catch {
      // silent
    }
  };

  const handleReviewRole = async (id: string, approved: boolean) => {
    try {
      await api.accessRequests.reviewRequest(id, approved, approved ? "Approved by Super Admin" : "Rejected");
      loadTabData("roles");
    } catch {
      // silent
    }
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen py-24 flex items-center justify-center">
        <LoadingSpinner label="Loading user portal..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen py-10 bg-slate-50/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* User Profile Header Card */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center text-xl font-bold uppercase shadow-sm">
              {user.fullName ? user.fullName[0] : "U"}
            </div>
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900">{user.fullName}</h1>
                <div className="flex flex-wrap gap-1">
                  {user.roles?.map((r) => {
                    const badge = getRoleBadge(r);
                    return (
                      <span
                        key={r}
                        className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border ${badge.className}`}
                      >
                        {badge.label}
                      </span>
                    );
                  })}
                </div>
              </div>
              <p className="text-xs text-slate-500">
                {user.email} {user.studentId ? `• ID: ${user.studentId}` : ""} {user.department ? `• ${user.department}` : ""}
              </p>
            </div>
          </div>

          {canManageEvents && (
            <div className="flex items-center gap-2">
              <Link
                href="/dashboard/create-event"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition-all"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Create Event Draft</span>
              </Link>
            </div>
          )}
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200 scrollbar-none text-xs font-semibold">
          <button
            onClick={() => setActiveTab("registrations")}
            className={`px-4 py-2.5 rounded-xl transition-all shrink-0 flex items-center gap-1.5 ${
              activeTab === "registrations"
                ? "bg-blue-600 text-white shadow-xs"
                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>My Registrations</span>
          </button>

          <button
            onClick={() => setActiveTab("certificates")}
            className={`px-4 py-2.5 rounded-xl transition-all shrink-0 flex items-center gap-1.5 ${
              activeTab === "certificates"
                ? "bg-blue-600 text-white shadow-xs"
                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>My Certificates</span>
          </button>

          <button
            onClick={() => setActiveTab("applications")}
            className={`px-4 py-2.5 rounded-xl transition-all shrink-0 flex items-center gap-1.5 ${
              activeTab === "applications"
                ? "bg-blue-600 text-white shadow-xs"
                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>My Applications</span>
          </button>

          <button
            onClick={() => setActiveTab("recommendations")}
            className={`px-4 py-2.5 rounded-xl transition-all shrink-0 flex items-center gap-1.5 ${
              activeTab === "recommendations"
                ? "bg-blue-600 text-white shadow-xs"
                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Recommended</span>
          </button>

          <button
            onClick={() => setActiveTab("attendance")}
            className={`px-4 py-2.5 rounded-xl transition-all shrink-0 flex items-center gap-1.5 ${
              activeTab === "attendance"
                ? "bg-blue-600 text-white shadow-xs"
                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>QR Attendance</span>
          </button>

          <button
            onClick={() => setActiveTab("notifications")}
            className={`px-4 py-2.5 rounded-xl transition-all shrink-0 flex items-center gap-1.5 ${
              activeTab === "notifications"
                ? "bg-blue-600 text-white shadow-xs"
                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            <Bell className="w-3.5 h-3.5" />
            <span>Notifications</span>
          </button>

          {(isFaculty || isSuperAdmin) && (
            <button
              onClick={() => setActiveTab("approvals")}
              className={`px-4 py-2.5 rounded-xl transition-all shrink-0 flex items-center gap-1.5 ${
                activeTab === "approvals"
                  ? "bg-blue-600 text-white shadow-xs"
                  : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Event Approvals</span>
            </button>
          )}

          {canManageEvents && (
            <button
              onClick={() => setActiveTab("certificate-studio")}
              className={`px-4 py-2.5 rounded-xl transition-all shrink-0 flex items-center gap-1.5 ${
                activeTab === "certificate-studio"
                  ? "bg-blue-600 text-white shadow-xs"
                  : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Certificate Studio (Admin)</span>
            </button>
          )}

          {isSuperAdmin && (
            <>
              <button
                onClick={() => setActiveTab("analytics")}
                className={`px-4 py-2.5 rounded-xl transition-all shrink-0 flex items-center gap-1.5 ${
                  activeTab === "analytics"
                    ? "bg-blue-600 text-white shadow-xs"
                    : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5" />
                <span>Campus Analytics</span>
              </button>

              <button
                onClick={() => setActiveTab("roles")}
                className={`px-4 py-2.5 rounded-xl transition-all shrink-0 flex items-center gap-1.5 ${
                  activeTab === "roles"
                    ? "bg-blue-600 text-white shadow-xs"
                    : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>Role Requests</span>
              </button>
            </>
          )}
        </div>

        {/* Tab Content Display */}
        {dataLoading ? (
          <div className="py-20">
            <LoadingSpinner label="Loading records..." />
          </div>
        ) : (
          <div>
            {/* Tab: My Registrations */}
            {activeTab === "registrations" && (
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-800">Your Registered Events</h3>
                {registrations.length === 0 ? (
                  <EmptyState
                    icon={Calendar}
                    title="No Registered Events"
                    description="You have not registered for any upcoming events yet. Discover student workshops and sessions in the event feed."
                    actionLabel="Discover Events"
                    actionHref="/events"
                  />
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {registrations.map((reg) => {
                      const badge = getRegistrationStatusBadge(reg.status);
                      return (
                        <div
                          key={reg.id}
                          className="glass-panel p-5 rounded-2xl border border-slate-200 flex flex-col justify-between space-y-3"
                        >
                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between">
                              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${badge.className}`}>
                                {badge.label}
                              </span>
                              <span className="text-[11px] text-slate-400">
                                {formatDate(reg.registeredAt)}
                              </span>
                            </div>
                            <h4 className="font-bold text-base text-slate-900">{reg.eventTitle}</h4>
                            <div className="text-xs text-slate-500 space-y-0.5">
                              <p>
                                {formatDate(reg.eventStartTime)} • {formatTime(reg.eventStartTime)}
                              </p>
                              <p>{reg.venueName || "Campus Venue"}</p>
                            </div>
                          </div>

                          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                            <span className="text-xs text-slate-500 font-medium">
                              Payment: {reg.paymentStatus}
                            </span>
                            <Link
                              href={`/events/${reg.eventId}`}
                              className="text-xs font-semibold text-blue-600 hover:underline"
                            >
                              Event Details →
                            </Link>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Tab: My Certificates */}
            {activeTab === "certificates" && (
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-800">Your Earned Certificates</h3>
                {certificates.length === 0 ? (
                  <EmptyState
                    icon={Award}
                    title="No Certificates Issued Yet"
                    description="Attend verified events and check in with your QR session to earn genuine digital certificates from campus organizers."
                    actionLabel="Browse Events"
                    actionHref="/events"
                  />
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {certificates.map((cert) => (
                      <div
                        key={cert.id}
                        className="glass-panel p-5 rounded-2xl border border-slate-200 space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                            {cert.clubName || "Campus Authority"}
                          </span>
                          <span className="text-[11px] font-mono text-slate-500">
                            {cert.certificateNumber}
                          </span>
                        </div>
                        <h4 className="font-bold text-base text-slate-900">{cert.eventTitle}</h4>
                        <p className="text-xs text-slate-500">Issued: {formatDate(cert.issuedAt)}</p>

                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                          <Link
                            href={`/verify?code=${cert.verificationCode}`}
                            className="text-xs text-blue-600 hover:underline font-medium inline-flex items-center gap-1"
                          >
                            <span>Verify Online</span>
                            <ExternalLink className="w-3 h-3" />
                          </Link>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handlePreviewCertificate(cert)}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-medium"
                              title="Preview certificate"
                            >
                              <Eye className="w-3.5 h-3.5 text-blue-600" />
                              <span>Preview</span>
                            </button>
                            <button
                              onClick={() => handleDownloadCertificate(cert)}
                              disabled={downloadingCertId === cert.id}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs disabled:opacity-50"
                              title="Download official PDF document"
                            >
                              {downloadingCertId === cert.id ? (
                                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              ) : (
                                <Download className="w-3.5 h-3.5" />
                              )}
                              <span>Download PDF</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Tab: My Applications */}
            {activeTab === "applications" && (
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-800">Recruitment Applications</h3>
                {applications.length === 0 ? (
                  <EmptyState
                    icon={Briefcase}
                    title="No Active Applications"
                    description="You have not submitted applications for any club executive positions."
                    actionLabel="Open Recruitment Drives"
                    actionHref="/recruitment"
                  />
                ) : (
                  <div className="space-y-3">
                    {applications.map((app) => (
                      <div
                        key={app.id}
                        className="glass-panel p-5 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                      >
                        <div className="space-y-1">
                          <span className="text-[10px] font-bold uppercase text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                            {app.status}
                          </span>
                          <h4 className="font-bold text-base text-slate-900">{app.positionTitle}</h4>
                          <p className="text-xs text-slate-500">{app.clubName}</p>
                          {app.interviewTime && (
                            <p className="text-xs text-emerald-700 font-medium">
                              Interview: {formatDate(app.interviewTime)} at {app.interviewVenue}
                            </p>
                          )}
                        </div>
                        <span className="text-xs text-slate-400">
                          Applied: {formatDate(app.appliedAt)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Tab: Recommendations */}
            {activeTab === "recommendations" && (
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-800">
                  Personalized Activity Recommendations
                </h3>
                {recommendations.length === 0 ? (
                  <EmptyState
                    icon={Sparkles}
                    title="No Recommendations Available"
                    description="Register for events or join clubs to help our engine tailor recommendations for you."
                    actionLabel="Explore All Events"
                    actionHref="/events"
                  />
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {recommendations.map((rec) => (
                      <div
                        key={rec.eventId}
                        className="glass-panel p-5 rounded-2xl border border-slate-200 space-y-2 flex flex-col justify-between"
                      >
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-bold text-blue-600 uppercase text-[10px]">
                              {rec.category || "Event"}
                            </span>
                            <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded">
                              Score: {Math.round((rec.score || 0) * 100)}% Match
                            </span>
                          </div>
                          <h4 className="font-bold text-base text-slate-900">{rec.title}</h4>
                          <p className="text-xs text-slate-500">{rec.explanation}</p>
                        </div>
                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                          <span className="text-xs text-slate-400">{formatDate(rec.startTime)}</span>
                          <Link
                            href={`/events/${rec.eventId}`}
                            className="text-xs font-semibold text-blue-600 hover:underline"
                          >
                            Register →
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Tab: Attendance Session Tools */}
            {activeTab === "attendance" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                {/* Student Check-in */}
                <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-200 space-y-4">
                  <div className="flex items-center gap-2">
                    <QrCode className="w-5 h-5 text-blue-600" />
                    <h3 className="font-bold text-base text-slate-900">Student Event Check-In</h3>
                  </div>
                  <p className="text-xs text-slate-500">
                    Enter the time-bound token revealed on the organizer&apos;s dynamic QR attendance screen.
                  </p>

                  {checkInStatus && (
                    <div
                      className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                        checkInStatus.startsWith("Error")
                          ? "bg-rose-50 text-rose-800 border border-rose-200"
                          : "bg-emerald-50 text-emerald-800 border border-emerald-200"
                      }`}
                    >
                      {checkInStatus.startsWith("Error") ? (
                        <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
                      ) : (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      )}
                      <span>{checkInStatus}</span>
                    </div>
                  )}

                  <form onSubmit={handleStudentCheckIn} className="space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Scanned Token / Session Payload
                      </label>
                      <input
                        type="text"
                        required
                        value={checkInToken}
                        onChange={(e) => setCheckInToken(e.target.value)}
                        placeholder="Paste verification token here..."
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={checkingIn || !checkInToken.trim()}
                      className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs disabled:opacity-50"
                    >
                      {checkingIn ? "Submitting Check-In..." : "Confirm Presence"}
                    </button>
                  </form>
                </div>

                {/* Organizer QR Session Start */}
                {canManageEvents && (
                  <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-200 space-y-4">
                    <div className="flex items-center gap-2">
                      <QrCode className="w-5 h-5 text-indigo-600" />
                      <h3 className="font-bold text-base text-slate-900">
                        Start Attendance Session (Club Admin)
                      </h3>
                    </div>
                    <p className="text-xs text-slate-500">
                      Generate a live, time-limited cryptographic session for event attendees.
                    </p>

                    {sessionError && (
                      <div className="p-3 bg-rose-50 text-rose-800 rounded-xl text-xs">
                        {sessionError}
                      </div>
                    )}

                    {createdSession && (
                      <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2 text-xs">
                        <p className="font-bold text-emerald-900">Session Activated!</p>
                        <p className="font-mono text-slate-700 bg-white p-2 rounded border border-emerald-100 break-all select-all">
                          {createdSession.qrPayload}
                        </p>
                        <p className="text-emerald-700">Expires: {formatDate(createdSession.expiresAt)}</p>
                      </div>
                    )}

                    <form onSubmit={handleStartQrSession} className="space-y-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Event UUID
                        </label>
                        <input
                          type="text"
                          required
                          value={qrEventId}
                          onChange={(e) => setQrEventId(e.target.value)}
                          placeholder="Event ID from managed events"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Duration (Minutes)
                        </label>
                        <input
                          type="number"
                          value={qrDuration}
                          onChange={(e) => setQrDuration(Number(e.target.value))}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs"
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={creatingSession || !qrEventId.trim()}
                        className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs disabled:opacity-50"
                      >
                        {creatingSession ? "Creating..." : "Start QR Session"}
                      </button>
                    </form>
                  </div>
                )}
              </div>
            )}

            {/* Tab: Notifications */}
            {activeTab === "notifications" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-800">Your Notifications</h3>
                  <button
                    onClick={() => {
                      api.notifications.markAllAsRead().then(() => loadTabData("notifications"));
                    }}
                    className="text-xs text-blue-600 font-semibold hover:underline"
                  >
                    Mark All as Read
                  </button>
                </div>

                {notifications.length === 0 ? (
                  <EmptyState
                    icon={Bell}
                    title="No Notifications"
                    description="You are completely caught up on announcements and updates."
                  />
                ) : (
                  <div className="space-y-2">
                    {notifications.map((n) => (
                      <div
                        key={n.id}
                        className={`p-4 rounded-xl border flex items-start justify-between gap-3 text-xs ${
                          n.read
                            ? "bg-white border-slate-200 text-slate-600"
                            : "bg-blue-50/50 border-blue-200 font-medium text-slate-800"
                        }`}
                      >
                        <div className="space-y-1">
                          <p className="font-bold text-sm text-slate-900">{n.title}</p>
                          <p>{n.message}</p>
                          <p className="text-[10px] text-slate-400">{formatDate(n.createdAt)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Tab: Event Approvals (Faculty / Super Admin) */}
            {activeTab === "approvals" && (isFaculty || isSuperAdmin) && (
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-800">Events Awaiting Faculty Review</h3>
                {pendingApprovals.length === 0 ? (
                  <EmptyState
                    icon={ShieldAlert}
                    title="Approval Queue Clear"
                    description="No events are currently awaiting faculty review."
                  />
                ) : (
                  <div className="space-y-3">
                    {pendingApprovals.map((e) => (
                      <div
                        key={e.id}
                        className="glass-panel p-5 rounded-2xl border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4"
                      >
                        <div className="space-y-1">
                          <span className="text-[10px] font-bold uppercase text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                            {e.status}
                          </span>
                          <h4 className="font-bold text-base text-slate-900">{e.title}</h4>
                          <p className="text-xs text-slate-500">
                            {e.clubName} • {formatDate(e.startTime)}
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleReviewEvent(e.id, "APPROVE")}
                            className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold"
                          >
                            Approve Event
                          </button>
                          <button
                            onClick={() => handleReviewEvent(e.id, "REQUEST_CHANGES", "Please adjust capacity")}
                            className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold"
                          >
                            Request Changes
                          </button>
                          <button
                            onClick={() => handleReviewEvent(e.id, "REJECT", "Does not meet criteria")}
                            className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold"
                          >
                            Reject
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Tab: Campus Analytics (Super Admin) */}
            {activeTab === "analytics" && isSuperAdmin && (
              <div className="space-y-6">
                <h3 className="text-sm font-bold text-slate-800">Campus-Wide Participation Analytics</h3>
                {campusAnalytics ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    <div className="glass-panel p-5 rounded-2xl border border-slate-200 space-y-1">
                      <p className="text-xs text-slate-500">Total Registered Clubs</p>
                      <p className="text-2xl font-extrabold text-blue-600">{campusAnalytics.totalClubs ?? 0}</p>
                    </div>
                    <div className="glass-panel p-5 rounded-2xl border border-slate-200 space-y-1">
                      <p className="text-xs text-slate-500">Total Events Hosted</p>
                      <p className="text-2xl font-extrabold text-indigo-600">{campusAnalytics.totalEvents ?? 0}</p>
                    </div>
                    <div className="glass-panel p-5 rounded-2xl border border-slate-200 space-y-1">
                      <p className="text-xs text-slate-500">Total Registrations</p>
                      <p className="text-2xl font-extrabold text-emerald-600">
                        {campusAnalytics.totalRegistrations ?? 0}
                      </p>
                    </div>
                    <div className="glass-panel p-5 rounded-2xl border border-slate-200 space-y-1">
                      <p className="text-xs text-slate-500">Verified Attendees</p>
                      <p className="text-2xl font-extrabold text-violet-600">
                        {campusAnalytics.totalVerifiedAttendees ?? 0}
                      </p>
                    </div>
                    <div className="glass-panel p-5 rounded-2xl border border-slate-200 space-y-1">
                      <p className="text-xs text-slate-500">Certificates Issued</p>
                      <p className="text-2xl font-extrabold text-purple-600">
                        {campusAnalytics.totalCertificatesIssued ?? 0}
                      </p>
                    </div>
                    <div className="glass-panel p-5 rounded-2xl border border-slate-200 space-y-1">
                      <p className="text-xs text-slate-500">Recruitment Drives</p>
                      <p className="text-2xl font-extrabold text-sky-600">
                        {campusAnalytics.totalRecruitmentDrives ?? 0}
                      </p>
                    </div>
                    <div className="glass-panel p-5 rounded-2xl border border-slate-200 space-y-1">
                      <p className="text-xs text-slate-500">Discussion Posts</p>
                      <p className="text-2xl font-extrabold text-rose-600">
                        {campusAnalytics.totalCampusVoicePosts ?? 0}
                      </p>
                    </div>
                    <div className="glass-panel p-5 rounded-2xl border border-slate-200 space-y-1">
                      <p className="text-xs text-slate-500">Overall Attendance Rate</p>
                      <p className="text-2xl font-extrabold text-emerald-600">
                        {Math.round((campusAnalytics.overallAttendanceRate || 0) * 100)}%
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-slate-400">Loading analytics...</p>
                )}
              </div>
            )}

            {/* Tab: Role Requests (Super Admin) */}
            {activeTab === "roles" && isSuperAdmin && (
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-800">Privileged Role Requests Review</h3>
                {roleRequests.length === 0 ? (
                  <EmptyState
                    icon={Users}
                    title="No Pending Role Requests"
                    description="No student or coordinator requests are currently pending review."
                  />
                ) : (
                  <div className="space-y-3">
                    {roleRequests.map((req) => (
                      <div
                        key={req.id}
                        className="glass-panel p-5 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                      >
                        <div className="space-y-1">
                          <span className="text-[10px] font-bold uppercase text-purple-700 bg-purple-50 px-2 py-0.5 rounded">
                            {req.requestedRole} ({req.status})
                          </span>
                          <h4 className="font-bold text-sm text-slate-900">{req.userFullName}</h4>
                          <p className="text-xs text-slate-500">{req.userEmail}</p>
                          <p className="text-xs text-slate-600 italic">&ldquo;{req.justification}&rdquo;</p>
                        </div>

                        {req.status === "PENDING" && (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleReviewRole(req.id, true)}
                              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleReviewRole(req.id, false)}
                              className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold"
                            >
                              Reject
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            {/* Tab: Certificate Studio (Club Admin / Faculty / Super Admin) */}
            {activeTab === "certificate-studio" && canManageEvents && (
              <ClubAdminCertificateManager />
            )}
          </div>
        )}

        {/* Certificate PDF Quick Preview Modal */}
        {previewCertBlobUrl && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <div className="w-full max-w-4xl bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 flex flex-col max-h-[90vh]">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h4 className="font-bold text-base text-slate-900">{previewCertTitle}</h4>
                  <p className="text-[11px] font-mono text-slate-500">Official CampusOS Digital Credential</p>
                </div>
                <button
                  onClick={handleCloseCertPreview}
                  className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 my-4 bg-slate-100 rounded-2xl overflow-hidden min-h-[460px]">
                <iframe
                  src={previewCertBlobUrl}
                  title="Certificate Document Preview"
                  className="w-full h-[520px] border-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2 text-xs">
                <button
                  onClick={handleCloseCertPreview}
                  className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen py-24 flex items-center justify-center">
          <LoadingSpinner label="Loading dashboard..." />
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}

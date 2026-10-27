"use client";

import React, { useEffect, useState, use, Suspense } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { EventItem, Registration } from "@/types/api";
import { api } from "@/lib/api-client";
import { useAuth } from "@/lib/auth-context";
import { formatDate, formatTime, getStatusBadge } from "@/lib/utils";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Ticket,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Share2,
  Building,
  Check,
  X,
} from "lucide-react";

function EventDetailContent({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const eventId = resolvedParams.id;
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();

  const [event, setEvent] = useState<EventItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Registration state
  const [registering, setRegistering] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState<Registration | null>(null);
  const [registrationError, setRegistrationError] = useState<string | null>(null);
  const [isRegistered, setIsRegistered] = useState(false);

  useEffect(() => {
    const loadEventData = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.events.getById(eventId);
        if (res?.data) {
          setEvent(res.data);
        } else {
          setError("Event not found");
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Failed to load event details";
        setError(msg);
      } finally {
        setLoading(false);
      }
    };

    loadEventData();
  }, [eventId]);

  // Check if current authenticated student is registered
  useEffect(() => {
    if (isAuthenticated) {
      api.registrations
        .getMyRegistrations(0, 50)
        .then((res) => {
          const found = res?.data?.content?.find((r) => r.eventId === eventId && r.status === "CONFIRMED");
          if (found) {
            setIsRegistered(true);
            setRegistrationSuccess(found);
          }
        })
        .catch(() => {});
    }
  }, [isAuthenticated, eventId]);

  const handleRegister = async () => {
    if (!isAuthenticated) {
      router.push(`/auth/login?redirect=/events/${eventId}`);
      return;
    }

    setRegistering(true);
    setRegistrationError(null);

    try {
      const res = await api.registrations.register(eventId);
      if (res?.data) {
        setIsRegistered(true);
        setRegistrationSuccess(res.data);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Registration failed";
      setRegistrationError(msg);
    } finally {
      setRegistering(false);
    }
  };

  const handleCancelRegistration = async () => {
    if (!confirm("Are you sure you want to cancel your event registration?")) return;

    setRegistering(true);
    setRegistrationError(null);

    try {
      await api.registrations.cancel(eventId);
      setIsRegistered(false);
      setRegistrationSuccess(null);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to cancel registration";
      setRegistrationError(msg);
    } finally {
      setRegistering(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen py-24 flex items-center justify-center">
        <LoadingSpinner label="Loading event information..." />
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen py-24 flex items-center justify-center px-4">
        <div className="glass-panel max-w-md p-8 rounded-2xl text-center space-y-4 border border-rose-200">
          <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
          <h2 className="text-lg font-bold text-slate-800">Event Unavailable</h2>
          <p className="text-xs text-slate-500">{error || "The requested event could not be found."}</p>
          <Link
            href="/events"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-lg"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Events Feed</span>
          </Link>
        </div>
      </div>
    );
  }

  const statusBadge = getStatusBadge(event.status);

  return (
    <div className="min-h-screen py-10 bg-slate-50/60">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Navigation Breadcrumb */}
        <div>
          <Link
            href="/events"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to all events</span>
          </Link>
        </div>

        {/* Hero Banner / Poster */}
        <div className="relative rounded-3xl overflow-hidden glass-panel border border-slate-200 shadow-md">
          <div className="relative h-64 sm:h-80 lg:h-96 w-full bg-gradient-to-tr from-blue-700 via-indigo-700 to-violet-800">
            {event.posterUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={event.posterUrl}
                alt={event.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex flex-col justify-end p-6 sm:p-10 text-white relative">
                <div className="absolute inset-0 bg-campus-grid opacity-25 pointer-events-none" />
                <div className="relative z-10 space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider bg-white/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
                      {event.category || "General Event"}
                    </span>
                    <span
                      className={`text-xs font-bold px-3 py-1 rounded-full border ${statusBadge.className}`}
                    >
                      {statusBadge.label}
                    </span>
                  </div>
                  <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                    {event.title}
                  </h1>
                  {event.clubName && (
                    <p className="text-sm text-blue-200 font-medium">
                      Organized by {event.clubName}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Main Grid: Details & Registration Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Event Details (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-200 space-y-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900 mb-2">About This Event</h2>
                <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                  {event.description || "No detailed description provided by organizer."}
                </p>
              </div>

              {/* Tags */}
              {event.tags && (
                <div className="pt-4 border-t border-slate-100">
                  <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                    Event Tags
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {event.tags.split(",").map((tag) => (
                      <span
                        key={tag.trim()}
                        className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-xs font-medium"
                      >
                        #{tag.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Venue & Organizer Details */}
              <div className="pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-xs text-slate-400 font-medium">Organizing Society</p>
                  <p className="text-sm font-semibold text-slate-800">
                    {event.clubName || "Campus Organization"}
                  </p>
                  {event.clubSlug && (
                    <Link
                      href={`/clubs/${event.clubSlug}`}
                      className="text-xs text-blue-600 hover:underline font-medium inline-block"
                    >
                      View Club Profile →
                    </Link>
                  )}
                </div>

                <div className="space-y-1">
                  <p className="text-xs text-slate-400 font-medium">Venue Location</p>
                  <p className="text-sm font-semibold text-slate-800">
                    {event.venueName || "Campus Hall (Allocated upon approval)"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Registration & Ticket Card (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="glass-panel-elevated p-6 rounded-2xl border border-slate-200 space-y-5">
              <div className="space-y-1 pb-4 border-b border-slate-100">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Registration Pass
                </span>
                <div className="flex items-baseline justify-between">
                  <span className="text-2xl font-extrabold text-slate-900">
                    {event.paid && event.feeAmount ? `₹${event.feeAmount}` : "Free Admission"}
                  </span>
                  <span className="text-xs text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    Official Pass
                  </span>
                </div>
              </div>

              {/* Schedule and venue breakdown */}
              <div className="space-y-3 text-xs text-slate-600">
                <div className="flex items-start gap-2.5">
                  <Calendar className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-slate-800">Date</p>
                    <p>{formatDate(event.startTime)}</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Clock className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-slate-800">Time</p>
                    <p>
                      {formatTime(event.startTime)} – {formatTime(event.endTime)}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-violet-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-slate-800">Venue</p>
                    <p>{event.venueName || "Campus Venue"}</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Users className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-slate-800">Capacity</p>
                    <p>{event.capacity} seats available</p>
                  </div>
                </div>
              </div>

              {/* Server Registration Error */}
              {registrationError && (
                <div className="rounded-xl bg-rose-50 border border-rose-200 p-3 text-xs text-rose-800 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  <span>{registrationError}</span>
                </div>
              )}

              {/* Registration Action */}
              <div className="pt-2">
                {isRegistered ? (
                  <div className="space-y-3">
                    <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-xs text-emerald-800 font-medium">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>You are registered for this event!</span>
                    </div>

                    <button
                      onClick={handleCancelRegistration}
                      disabled={registering}
                      className="w-full py-2.5 px-4 rounded-xl border border-rose-200 bg-white hover:bg-rose-50 text-rose-700 text-xs font-semibold transition-all"
                    >
                      {registering ? "Cancelling..." : "Cancel Registration"}
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={handleRegister}
                    disabled={registering || event.status !== "PUBLISHED"}
                    className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-0.5"
                  >
                    {registering ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : event.status !== "PUBLISHED" ? (
                      <span>Registrations Closed ({statusBadge.label})</span>
                    ) : (
                      <>
                        <Ticket className="w-4 h-4" />
                        <span>Register Now</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function EventDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen py-24 flex items-center justify-center">
          <LoadingSpinner label="Loading event information..." />
        </div>
      }
    >
      <EventDetailContent params={params} />
    </Suspense>
  );
}

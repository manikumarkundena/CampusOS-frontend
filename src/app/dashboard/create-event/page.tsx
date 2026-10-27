"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { api } from "@/lib/api-client";
import { ClubItem, Venue } from "@/types/api";
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
  Building,
} from "lucide-react";

export default function CreateEventPage() {
  const router = useRouter();
  const { user, isAuthenticated, canManageEvents } = useAuth();

  const [clubs, setClubs] = useState<ClubItem[]>([]);
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loadingClubs, setLoadingClubs] = useState(true);

  // Form fields
  const [clubId, setClubId] = useState("");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Technical");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [venueId, setVenueId] = useState("");
  const [capacity, setCapacity] = useState(100);
  const [isPaid, setIsPaid] = useState(false);
  const [feeAmount, setFeeAmount] = useState(0);
  const [posterUrl, setPosterUrl] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/login?redirect=/dashboard/create-event");
      return;
    }

    const loadMetadata = async () => {
      try {
        const [clubsRes, venuesRes] = await Promise.allSettled([
          api.clubs.search({ page: 0, size: 50 }),
          api.venues.getAll(0, 50),
        ]);

        if (clubsRes.status === "fulfilled" && clubsRes.value?.data) {
          const list = clubsRes.value.data.content || [];
          setClubs(list);
          if (list.length > 0) setClubId(list[0].id);
        }

        if (venuesRes.status === "fulfilled" && venuesRes.value?.data) {
          setVenues(venuesRes.value.data.content || []);
        }
      } catch {
        // non-blocking
      } finally {
        setLoadingClubs(false);
      }
    };

    loadMetadata();
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clubId) {
      setError("Please select an organizing club or enter a valid Club UUID.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const res = await api.events.create({
        clubId,
        title,
        category,
        description: description.trim() || undefined,
        tags: tags.trim() || undefined,
        startTime: new Date(startTime).toISOString(),
        endTime: new Date(endTime).toISOString(),
        capacity: Number(capacity),
        venueId: venueId.trim() || undefined,
        isRegistrationRequired: true,
        isPaid,
        feeAmount: isPaid ? Number(feeAmount) : 0,
        posterUrl: posterUrl.trim() || undefined,
      });

      if (res?.data) {
        setSuccess(true);
        setTimeout(() => {
          router.push(`/events/${res.data.id}`);
        }, 1500);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to create event draft";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen py-10 bg-slate-50/60">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </Link>
        </div>

        <div className="glass-panel p-6 sm:p-10 rounded-3xl border border-slate-200/80 shadow-md space-y-6">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Create Campus Event Draft
            </h1>
            <p className="text-xs text-slate-500">
              Event proposals will be submitted for faculty coordinator review and venue allocation.
            </p>
          </div>

          {success ? (
            <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-2">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
              <h3 className="font-bold text-emerald-900">Event Draft Created!</h3>
              <p className="text-xs text-emerald-700">Redirecting to event profile...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-2.5 text-xs text-rose-800">
                  <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              {/* Club Selector */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">
                  Organizing Club / Guild <span className="text-rose-500">*</span>
                </label>
                {clubs.length > 0 ? (
                  <select
                    value={clubId}
                    onChange={(e) => setClubId(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {clubs.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.category})
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    required
                    value={clubId}
                    onChange={(e) => setClubId(e.target.value)}
                    placeholder="Enter Club UUID (e.g. from club profile URL)"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-900"
                  />
                )}
              </div>

              {/* Event Title */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">
                  Event Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Annual Autonomous Robotics Showcase 2026"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-900"
                />
              </div>

              {/* Category & Capacity */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-900"
                  >
                    <option value="Technical">Technical</option>
                    <option value="Cultural">Cultural</option>
                    <option value="Workshop">Workshop</option>
                    <option value="Hackathon">Hackathon</option>
                    <option value="Symposium">Symposium</option>
                    <option value="Sports">Sports</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700">
                    Capacity (Seats) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={capacity}
                    onChange={(e) => setCapacity(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-900"
                  />
                </div>
              </div>

              {/* Start & End Times */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700">
                    Start Date & Time <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-900"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700">
                    End Date & Time <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-900"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">Description</label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Outline the schedule, speaker details, and prerequisites..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-900"
                />
              </div>

              {/* Tags & Poster */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700">
                    Tags (Comma-separated)
                  </label>
                  <input
                    type="text"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    placeholder="ai, robotics, contest"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-900"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700">
                    Poster Image URL (Optional)
                  </label>
                  <input
                    type="url"
                    value={posterUrl}
                    onChange={(e) => setPosterUrl(e.target.value)}
                    placeholder="https://... or uploaded image URL"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-900"
                  />
                </div>
              </div>

              {/* Paid Event Toggle */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-slate-800">Registration Fee</p>
                    <p className="text-[11px] text-slate-500">Requires student registration payment</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={isPaid}
                    onChange={(e) => setIsPaid(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                  />
                </div>

                {isPaid && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Fee Amount (₹ INR)
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={feeAmount}
                      onChange={(e) => setFeeAmount(Number(e.target.value))}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-900"
                    />
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-md shadow-blue-500/20 transition-all disabled:opacity-50"
              >
                {submitting ? "Creating Event Draft..." : "Save Event Draft"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

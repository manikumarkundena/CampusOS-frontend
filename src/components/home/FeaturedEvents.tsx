"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { EventItem } from "@/types/api";
import { api } from "@/lib/api-client";
import { EventCard } from "@/components/events/EventCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Calendar, ArrowRight, RefreshCw, AlertCircle } from "lucide-react";

export function FeaturedEvents() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.events.search({ page: 0, size: 6 });
      setEvents(response?.data?.content || []);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to load events";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <section className="py-16 bg-white border-y border-slate-200/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 uppercase tracking-wider">
              <Calendar className="w-4 h-4" />
              <span>Campus Calendar</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Upcoming Campus Events
            </h2>
            <p className="text-sm text-slate-500 max-w-xl">
              Authentic schedules published by verified student clubs and authorized campus
              departments.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/events/calendar"
              className="px-3.5 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              Calendar View
            </Link>
            <Link
              href="/events"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-all shadow-blue-500/20"
            >
              <span>View All Events</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Content State */}
        {loading ? (
          <div className="py-12">
            <LoadingSpinner label="Fetching live events from Spring Boot backend..." />
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-rose-200 bg-rose-50/70 p-6 text-center max-w-lg mx-auto">
            <AlertCircle className="w-8 h-8 text-rose-500 mx-auto mb-2" />
            <h3 className="text-sm font-semibold text-rose-900">Backend Connection Notice</h3>
            <p className="text-xs text-rose-700 mt-1 mb-4">{error}</p>
            <button
              onClick={fetchEvents}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-white border border-rose-300 text-xs font-medium text-rose-800 hover:bg-rose-100 transition-colors shadow-xs"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retry Fetch</span>
            </button>
          </div>
        ) : events.length === 0 ? (
          <EmptyState
            icon={Calendar}
            title="No Published Events Right Now"
            description="The campus event feed is currently clear. Authorized club admins can create drafts and submit them for faculty review through the dashboard."
            actionLabel="Discover Student Clubs"
            actionHref="/clubs"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

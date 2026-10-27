"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { EventItem } from "@/types/api";
import { api } from "@/lib/api-client";
import { EventCard } from "@/components/events/EventCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Calendar, Search, Filter, RefreshCw, AlertCircle, CalendarDays } from "lucide-react";

const CATEGORIES = [
  "All",
  "Technical",
  "Cultural",
  "Workshop",
  "Hackathon",
  "Symposium",
  "Sports",
  "Academic",
];

export default function EventsDiscoveryPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSearch, setActiveSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const loadEvents = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const categoryParam = selectedCategory === "All" ? undefined : selectedCategory;
      const searchParam = activeSearch.trim() || undefined;

      const res = await api.events.search({
        category: categoryParam,
        search: searchParam,
        page: currentPage,
        size: 9,
      });

      if (res?.data) {
        setEvents(res.data.content || []);
        setTotalPages(res.data.totalPages || 0);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to load events";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, activeSearch, currentPage]);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(0);
    setActiveSearch(searchQuery);
  };

  return (
    <div className="min-h-screen py-10 bg-slate-50/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200/80 pb-6">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 uppercase tracking-wider">
              <Calendar className="w-4 h-4" />
              <span>Campus Events Feed</span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Discover Campus Events
            </h1>
            <p className="text-sm text-slate-500">
              Browse approved and published university symposiums, workshops, and club gatherings.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/events/calendar"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-xs transition-colors"
            >
              <CalendarDays className="w-4 h-4 text-blue-600" />
              <span>Interactive Calendar</span>
            </Link>
          </div>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="space-y-4">
          <form onSubmit={handleSearchSubmit} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search events by title, topic, or keyword..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-xs"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all"
            >
              Search
            </button>
          </form>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0 mr-1" />
            {CATEGORIES.map((category) => {
              const isSelected = selectedCategory === category;
              return (
                <button
                  key={category}
                  onClick={() => {
                    setSelectedCategory(category);
                    setCurrentPage(0);
                  }}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all shrink-0 ${
                    isSelected
                      ? "bg-blue-600 text-white shadow-xs font-semibold"
                      : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Content Area */}
        {loading ? (
          <div className="py-20">
            <LoadingSpinner label="Fetching verified events..." />
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-rose-200 bg-rose-50/70 p-8 text-center max-w-lg mx-auto">
            <AlertCircle className="w-8 h-8 text-rose-500 mx-auto mb-2" />
            <h3 className="text-sm font-semibold text-rose-900">Backend Communication Issue</h3>
            <p className="text-xs text-rose-700 mt-1 mb-4">{error}</p>
            <button
              onClick={loadEvents}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white border border-rose-300 text-xs font-medium text-rose-800 hover:bg-rose-100 transition-colors shadow-xs"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retry</span>
            </button>
          </div>
        ) : events.length === 0 ? (
          <EmptyState
            icon={Calendar}
            title={
              activeSearch || selectedCategory !== "All"
                ? "No Matching Events Found"
                : "No Events Published"
            }
            description={
              activeSearch || selectedCategory !== "All"
                ? "Try adjusting your search keywords or resetting the category filter."
                : "There are no published events in this view right now. Check back soon!"
            }
            actionLabel={
              activeSearch || selectedCategory !== "All" ? "Reset Filters" : "Explore Clubs"
            }
            onActionClick={
              activeSearch || selectedCategory !== "All"
                ? () => {
                    setSelectedCategory("All");
                    setActiveSearch("");
                    setSearchQuery("");
                  }
                : undefined
            }
            actionHref={
              activeSearch || selectedCategory !== "All" ? undefined : "/clubs"
            }
          />
        ) : (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-4">
                <button
                  disabled={currentPage === 0}
                  onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
                  className="px-3.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50"
                >
                  Previous
                </button>
                <span className="text-xs text-slate-500 px-2">
                  Page {currentPage + 1} of {totalPages}
                </span>
                <button
                  disabled={currentPage >= totalPages - 1}
                  onClick={() => setCurrentPage((p) => p + 1)}
                  className="px-3.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

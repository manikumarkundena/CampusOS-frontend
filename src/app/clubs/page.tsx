"use client";

import React, { useEffect, useState, useCallback } from "react";
import { ClubItem } from "@/types/api";
import { api } from "@/lib/api-client";
import { ClubCard } from "@/components/clubs/ClubCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Users, Search, Filter, RefreshCw, AlertCircle, Building2 } from "lucide-react";

const CLUB_CATEGORIES = [
  "All",
  "Technical",
  "Cultural",
  "Arts & Media",
  "Entrepreneurship",
  "Sports",
  "Social & Community",
];

export default function ClubsDirectoryPage() {
  const [clubs, setClubs] = useState<ClubItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSearch, setActiveSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const loadClubs = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const categoryParam = selectedCategory === "All" ? undefined : selectedCategory;
      const searchParam = activeSearch.trim() || undefined;

      const res = await api.clubs.search({
        category: categoryParam,
        search: searchParam,
        page: currentPage,
        size: 12,
      });

      if (res?.data) {
        setClubs(res.data.content || []);
        setTotalPages(res.data.totalPages || 0);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to load clubs";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, activeSearch, currentPage]);

  useEffect(() => {
    loadClubs();
  }, [loadClubs]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(0);
    setActiveSearch(searchQuery);
  };

  return (
    <div className="min-h-screen py-10 bg-slate-50/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="border-b border-slate-200/80 pb-6 space-y-1.5">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 uppercase tracking-wider">
            <Users className="w-4 h-4" />
            <span>Collegiate Societies</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Student Clubs & Communities
          </h1>
          <p className="text-sm text-slate-500">
            Discover student-led clubs, technical chapters, and cultural organizations recognized by
            the university.
          </p>
        </div>

        {/* Search & Categories */}
        <div className="space-y-4">
          <form onSubmit={handleSearchSubmit} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search clubs by name, category, or keyword..."
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
            {CLUB_CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => {
                    setSelectedCategory(cat);
                    setCurrentPage(0);
                  }}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all shrink-0 ${
                    isSelected
                      ? "bg-blue-600 text-white shadow-xs font-semibold"
                      : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Area */}
        {loading ? (
          <div className="py-20">
            <LoadingSpinner label="Fetching verified campus clubs..." />
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-rose-200 bg-rose-50/70 p-8 text-center max-w-lg mx-auto">
            <AlertCircle className="w-8 h-8 text-rose-500 mx-auto mb-2" />
            <h3 className="text-sm font-semibold text-rose-900">Communication Notice</h3>
            <p className="text-xs text-rose-700 mt-1 mb-4">{error}</p>
            <button
              onClick={loadClubs}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white border border-rose-300 text-xs font-medium text-rose-800 hover:bg-rose-100 transition-colors shadow-xs"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retry</span>
            </button>
          </div>
        ) : clubs.length === 0 ? (
          <EmptyState
            icon={Building2}
            title={
              activeSearch || selectedCategory !== "All"
                ? "No Matching Clubs Found"
                : "No Clubs Listed in Directory"
            }
            description={
              activeSearch || selectedCategory !== "All"
                ? "Try adjusting your search criteria or resetting filters."
                : "Student organizations are currently being onboarded by university administrators."
            }
            actionLabel={
              activeSearch || selectedCategory !== "All" ? "Reset Filters" : "View Events"
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
              activeSearch || selectedCategory !== "All" ? undefined : "/events"
            }
          />
        ) : (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {clubs.map((club) => (
                <ClubCard key={club.id} club={club} />
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

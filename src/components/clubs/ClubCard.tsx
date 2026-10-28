import React from "react";
import Link from "next/link";
import { ClubItem } from "@/types/api";
import { Users, ArrowRight, ShieldCheck } from "lucide-react";

export function ClubCard({ club }: { club: ClubItem }) {
  return (
    <div className="glass-panel interactive-card rounded-2xl overflow-hidden flex flex-col justify-between border border-slate-200/80 group">
      <div>
        {/* Banner or Graphic Header */}
        <div className="h-28 w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 relative overflow-hidden">
          {club.bannerUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={club.bannerUrl}
              alt={club.name}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 bg-slate-100 opacity-60 pointer-events-none" />
          )}

          {/* Category Pill */}
          <div className="absolute top-3 left-3">
            <span className="text-[10px] font-bold uppercase tracking-wider bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full text-blue-900 border border-white/50 shadow-xs">
              {club.category || "Student Society"}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 space-y-3">
          <div className="flex items-start justify-between gap-2">
            <Link href={`/clubs/${club.slug}`}>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                {club.name}
              </h3>
            </Link>
          </div>

          {club.description && (
            <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
              {club.description}
            </p>
          )}

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <div className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-blue-600" />
              <span>{club.memberCount ?? 0} Members</span>
            </div>

            {club.facultyCoordinatorName && (
              <div className="flex items-center gap-1 text-[11px] text-slate-600 truncate max-w-[150px]">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span className="truncate">{club.facultyCoordinatorName}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="px-5 pb-5 pt-0">
        <Link
          href={`/clubs/${club.slug}`}
          className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 hover:border-slate-300 transition-colors"
        >
          <span>Explore Society</span>
          <ArrowRight className="w-3 h-3 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </div>
  );
}

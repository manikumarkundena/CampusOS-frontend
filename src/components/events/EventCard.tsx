import React from "react";
import Link from "next/link";
import { EventItem } from "@/types/api";
import { formatDate, formatTime, getStatusBadge } from "@/lib/utils";
import { Calendar, MapPin, Users, Ticket, ArrowRight } from "lucide-react";

export function EventCard({ event }: { event: EventItem }) {
  const statusBadge = getStatusBadge(event.status);

  return (
    <div className="glass-panel interactive-card rounded-2xl overflow-hidden flex flex-col group border border-slate-200/80">
      {/* Visual Header / Poster */}
      <div className="relative h-44 w-full bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-600 overflow-hidden">
        {event.posterUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={event.posterUrl}
            alt={event.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex flex-col justify-between p-4 text-white">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-wider bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/20">
                {event.category || "General"}
              </span>
              <span
                className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${statusBadge.className}`}
              >
                {statusBadge.label}
              </span>
            </div>

            <div className="space-y-0.5">
              <p className="text-xs text-blue-100 font-medium">{event.clubName || "Student Club"}</p>
              <h3 className="text-base font-bold text-white line-clamp-1">{event.title}</h3>
            </div>
          </div>
        )}

        {/* If poster exists, status badge sits over image */}
        {event.posterUrl && (
          <div className="absolute top-3 right-3">
            <span
              className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border shadow-sm ${statusBadge.className}`}
            >
              {statusBadge.label}
            </span>
          </div>
        )}
      </div>

      {/* Body Details */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2.5">
          <Link href={`/events/${event.id}`}>
            <h3 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1 text-base">
              {event.title}
            </h3>
          </Link>

          {event.description && (
            <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
              {event.description}
            </p>
          )}

          <div className="space-y-1.5 pt-1 text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span>
                {formatDate(event.startTime)}
                {event.startTime && ` • ${formatTime(event.startTime)}`}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
              <span className="truncate">{event.venueName || "Campus Venue TBD"}</span>
            </div>

            <div className="flex items-center gap-2">
              <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>Capacity: {event.capacity} seats</span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Ticket className="w-4 h-4 text-emerald-600" />
            <span className="text-xs font-semibold text-slate-700">
              {event.paid && event.feeAmount ? `₹${event.feeAmount}` : "Free Admission"}
            </span>
          </div>

          <Link
            href={`/events/${event.id}`}
            className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 group-hover:translate-x-0.5 transition-transform"
          >
            <span>Details</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}

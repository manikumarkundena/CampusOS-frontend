"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { EventItem } from "@/types/api";
import { api } from "@/lib/api-client";
import { formatDate, formatTime, getStatusBadge } from "@/lib/utils";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  Clock,
  MapPin,
  Ticket,
} from "lucide-react";

export default function CalendarViewPage() {
  const [currentDate, setCurrentDate] = useState<Date>(new Date(2026, 9, 1));
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDayEvents, setSelectedDayEvents] = useState<EventItem[]>([]);
  const [selectedDateStr, setSelectedDateStr] = useState<string>("");

  useEffect(() => {
    setCurrentDate(new Date());
  }, []);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const startOfMonth = new Date(year, month, 1);
  const endOfMonth = new Date(year, month + 1, 0, 23, 59, 59);

  useEffect(() => {
    const fetchCalendarEvents = async () => {
      setLoading(true);
      try {
        const startIso = startOfMonth.toISOString();
        const endIso = endOfMonth.toISOString();
        const res = await api.events.getCalendar(startIso, endIso);
        const list = res?.data || [];
        setEvents(list);

        // Pre-select today or first day with events
        const todayStr = new Date().toISOString().split("T")[0];
        const dayEvents = list.filter((e) => e.startTime.startsWith(todayStr));
        setSelectedDayEvents(dayEvents);
        setSelectedDateStr(todayStr);
      } catch {
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCalendarEvents();
  }, [year, month]);

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  // Compute calendar grid days
  const firstDayOfWeek = startOfMonth.getDay();
  const daysInMonth = endOfMonth.getDate();
  const days = [];
  for (let i = 0; i < firstDayOfWeek; i++) {
    days.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    days.push(d);
  }

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];

  const handleSelectDay = (day: number) => {
    const dStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    setSelectedDateStr(dStr);
    const dayEvts = events.filter((e) => e.startTime && e.startTime.startsWith(dStr));
    setSelectedDayEvents(dayEvts);
  };

  return (
    <div className="min-h-screen py-10 bg-slate-50/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-6">
          <div className="space-y-1">
            <Link
              href="/events"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-blue-600 mb-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Events Feed</span>
            </Link>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Campus Calendar
            </h1>
            <p className="text-sm text-slate-500">
              Interactive timeline of university symposiums, workshops, and student society meetups.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={prevMonth}
              className="p-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700"
              aria-label="Previous Month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-bold text-slate-800 text-sm px-3">
              {monthNames[month]} {year}
            </span>
            <button
              onClick={nextMonth}
              className="p-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700"
              aria-label="Next Month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Calendar Grid + Day Details Drawer */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Calendar Table (8 cols) */}
          <div className="lg:col-span-8 glass-panel p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="grid grid-cols-7 gap-2 mb-3 text-center text-xs font-bold text-slate-400 uppercase tracking-wider">
              <span>Sun</span>
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
            </div>

            {loading ? (
              <div className="py-20">
                <LoadingSpinner label="Loading monthly schedule..." />
              </div>
            ) : (
              <div className="grid grid-cols-7 gap-2">
                {days.map((day, idx) => {
                  if (day === null) {
                    return <div key={`empty-${idx}`} className="h-24 rounded-xl bg-slate-50/50" />;
                  }

                  const dStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                  const dayEvts = events.filter((e) => e.startTime && e.startTime.startsWith(dStr));
                  const isSelected = selectedDateStr === dStr;

                  return (
                    <button
                      key={`day-${day}`}
                      onClick={() => handleSelectDay(day)}
                      className={`h-24 p-2 rounded-xl border text-left flex flex-col justify-between transition-all ${
                        isSelected
                          ? "border-blue-500 bg-blue-50/50 ring-2 ring-blue-500/20"
                          : "border-slate-200 bg-white hover:border-slate-300"
                      }`}
                    >
                      <span className="text-xs font-bold text-slate-800">{day}</span>
                      <div className="space-y-1 overflow-hidden">
                        {dayEvts.slice(0, 2).map((e) => (
                          <div
                            key={e.id}
                            className="text-[10px] truncate px-1.5 py-0.5 rounded bg-blue-100/70 text-blue-800 font-medium"
                          >
                            {e.title}
                          </div>
                        ))}
                        {dayEvts.length > 2 && (
                          <span className="text-[9px] text-slate-500 font-semibold pl-1">
                            +{dayEvts.length - 2} more
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Selected Day Agenda (4 cols) */}
          <div className="lg:col-span-4 glass-panel p-6 rounded-2xl border border-slate-200 space-y-4">
            <h3 className="font-bold text-base text-slate-900 border-b border-slate-100 pb-3 flex items-center justify-between">
              <span>Selected Day Agenda</span>
              <span className="text-xs font-normal text-slate-500">{selectedDateStr}</span>
            </h3>

            {selectedDayEvents.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-400 space-y-2">
                <CalendarIcon className="w-8 h-8 mx-auto text-slate-300" />
                <p>No events scheduled for this day.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {selectedDayEvents.map((evt) => {
                  const statusBadge = getStatusBadge(evt.status);
                  return (
                    <div
                      key={evt.id}
                      className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                          {evt.category || "Event"}
                        </span>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${statusBadge.className}`}>
                          {statusBadge.label}
                        </span>
                      </div>
                      <h4 className="font-bold text-sm text-slate-900">{evt.title}</h4>
                      <div className="space-y-1 text-xs text-slate-500">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-blue-600" />
                          <span>
                            {formatTime(evt.startTime)} – {formatTime(evt.endTime)}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-indigo-600" />
                          <span className="truncate">{evt.venueName || "Campus Venue"}</span>
                        </div>
                      </div>
                      <Link
                        href={`/events/${evt.id}`}
                        className="w-full inline-flex items-center justify-center gap-1 text-xs font-semibold py-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 mt-1"
                      >
                        <Ticket className="w-3.5 h-3.5" />
                        <span>View Details</span>
                      </Link>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

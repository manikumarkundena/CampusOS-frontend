import { EventStatus, RegistrationStatus, UserRole } from "@/types/api";

export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function formatDate(dateString?: string): string {
  if (!dateString) return "Date TBD";
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(d);
  } catch {
    return dateString;
  }
}

export function formatTime(dateString?: string): string {
  if (!dateString) return "";
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return "";
    return new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }).format(d);
  } catch {
    return "";
  }
}

export function formatDateTime(dateString?: string): string {
  if (!dateString) return "TBD";
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }).format(d);
  } catch {
    return dateString;
  }
}

export function getStatusBadge(status?: EventStatus | string): {
  label: string;
  className: string;
} {
  switch (status) {
    case "PUBLISHED":
      return {
        label: "Published",
        className: "bg-emerald-50 text-emerald-700 border-emerald-200",
      };
    case "APPROVED":
      return {
        label: "Approved",
        className: "bg-blue-50 text-blue-700 border-blue-200",
      };
    case "SUBMITTED_FOR_APPROVAL":
      return {
        label: "Under Faculty Review",
        className: "bg-amber-50 text-amber-700 border-amber-200",
      };
    case "CHANGES_REQUESTED":
      return {
        label: "Changes Requested",
        className: "bg-orange-50 text-orange-700 border-orange-200",
      };
    case "DRAFT":
      return {
        label: "Draft",
        className: "bg-slate-100 text-slate-700 border-slate-200",
      };
    case "COMPLETED":
      return {
        label: "Completed",
        className: "bg-purple-50 text-purple-700 border-purple-200",
      };
    case "CANCELLED":
      return {
        label: "Cancelled",
        className: "bg-rose-50 text-rose-700 border-rose-200",
      };
    case "REJECTED":
      return {
        label: "Rejected",
        className: "bg-red-50 text-red-700 border-red-200",
      };
    default:
      return {
        label: status || "Unknown",
        className: "bg-slate-100 text-slate-700 border-slate-200",
      };
  }
}

export function getRegistrationStatusBadge(status?: RegistrationStatus | string): {
  label: string;
  className: string;
} {
  switch (status) {
    case "CONFIRMED":
      return {
        label: "Confirmed",
        className: "bg-emerald-50 text-emerald-700 border-emerald-200",
      };
    case "WAITLISTED":
      return {
        label: "Waitlisted",
        className: "bg-amber-50 text-amber-700 border-amber-200",
      };
    case "CANCELLED":
      return {
        label: "Cancelled",
        className: "bg-rose-50 text-rose-700 border-rose-200",
      };
    default:
      return {
        label: status || "Unknown",
        className: "bg-slate-100 text-slate-700 border-slate-200",
      };
  }
}

export function getRoleBadge(role: UserRole | string): {
  label: string;
  className: string;
} {
  switch (role) {
    case "SUPER_ADMIN":
      return {
        label: "Super Admin",
        className: "bg-indigo-50 text-indigo-700 border-indigo-200",
      };
    case "FACULTY_COORDINATOR":
      return {
        label: "Faculty Coordinator",
        className: "bg-purple-50 text-purple-700 border-purple-200",
      };
    case "CLUB_ADMIN":
      return {
        label: "Club Admin",
        className: "bg-blue-50 text-blue-700 border-blue-200",
      };
    case "STUDENT":
      return {
        label: "Student",
        className: "bg-emerald-50 text-emerald-700 border-emerald-200",
      };
    default:
      return {
        label: role,
        className: "bg-slate-100 text-slate-700 border-slate-200",
      };
  }
}

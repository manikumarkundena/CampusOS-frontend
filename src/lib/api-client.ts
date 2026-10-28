import {
  ApiResponse,
  PagedResponse,
  UserProfile,
  AuthResponse,
  RegisterRequest,
  LoginRequest,
  RefreshTokenRequest,
  ChangePasswordRequest,
  UpdateProfileRequest,
  EventItem,
  CreateEventRequest,
  UpdateEventRequest,
  EventApprovalDecisionRequest,
  ClubItem,
  CreateClubRequest,
  UpdateClubRequest,
  ClubMember,
  AssignClubMemberRequest,
  Registration,
  CampusVoicePost,
  CampusVoiceComment,
  CreatePostRequest,
  CreateCommentRequest,
  ReportPostRequest,
  Certificate,
  PublicCertificateVerification,
  CertificateTemplateResponse,
  BulkIssuePreviewResponse,
  BulkIssueRequest,
  BulkIssueResponse,
  BatchDeliveryStatusResponse,
  CertificatePreviewRequest,
  UpdateCertificateTemplateRequest,
  RecruitmentDrive,
  RecruitmentPosition,
  RecruitmentApplication,
  SubmitApplicationRequest,
  Venue,
  NotificationItem,
  RecommendationItem,
  CampusAnalytics,
  ClubAnalytics,
  RoleAccessRequest,
  AttendanceSession,
  AttendanceRecord,
  AttendanceStats,
  ApiError,
  UserRole,
} from "@/types/api";

const rawBase = (
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://campusos-backend-9edc.onrender.com"
)
  .trim()
  .replace(/\/+$/, "");

// Normalized server origin without /api/v1 (e.g. https://campusos-backend-9edc.onrender.com)
export const API_SERVER_ORIGIN = rawBase.replace(/\/api\/v1$/, "");

// Standard API base url ending with /api/v1
export const API_BASE_URL = `${API_SERVER_ORIGIN}/api/v1`;

class ApiClientError extends Error {
  status: number;
  errorCode?: string;

  constructor(message: string, status: number, errorCode?: string) {
    super(message);
    this.name = "ApiClientError";
    this.status = status;
    this.errorCode = errorCode;
  }
}

// Token storage helpers (safe for SSR)
export const TOKEN_STORAGE_KEY = "campusos_access_token";
export const REFRESH_TOKEN_STORAGE_KEY = "campusos_refresh_token";

export function getStoredAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_STORAGE_KEY);
}

export function getStoredRefreshToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(REFRESH_TOKEN_STORAGE_KEY);
}

export function storeTokens(accessToken: string, refreshToken: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(TOKEN_STORAGE_KEY, accessToken);
  localStorage.setItem(REFRESH_TOKEN_STORAGE_KEY, refreshToken);
}

export function clearStoredTokens() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_STORAGE_KEY);
  localStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY);
}

let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

function onTokenRefreshed(token: string) {
  refreshSubscribers.forEach((callback) => callback(token));
  refreshSubscribers = [];
}

function addRefreshSubscriber(callback: (token: string) => void) {
  refreshSubscribers.push(callback);
}

export function resolveUrl(endpoint: string): string {
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  if (cleanEndpoint.startsWith("/api/v1")) {
    return `${API_SERVER_ORIGIN}${cleanEndpoint}`;
  }
  return `${API_BASE_URL}${cleanEndpoint}`;
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {},
  isRetry = false
): Promise<T> {
  const url = resolveUrl(endpoint);
  const headers = new Headers(options.headers || {});

  if (!headers.has("Content-Type") && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  const token = getStoredAccessToken();
  if (token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  let response: Response;
  try {
    response = await fetch(url, {
      ...options,
      headers,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Network error";
    throw new ApiClientError(
      `Cannot connect to CampusOS backend service at ${API_BASE_URL}. (${message})`,
      0
    );
  }

  // Handle 401 Unauthorized with token refresh
  if (response.status === 401 && !isRetry) {
    const refreshToken = getStoredRefreshToken();
    if (refreshToken && endpoint !== "/api/v1/auth/refresh" && endpoint !== "/api/v1/auth/login") {
      if (!isRefreshing) {
        isRefreshing = true;
        try {
          const refreshRes = await fetch(`${API_SERVER_ORIGIN}/api/v1/auth/refresh`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refreshToken }),
          });

          if (refreshRes.ok) {
            const refreshData: ApiResponse<AuthResponse> = await refreshRes.json();
            storeTokens(refreshData.data.accessToken, refreshData.data.refreshToken);
            onTokenRefreshed(refreshData.data.accessToken);
            isRefreshing = false;
            return request<T>(endpoint, options, true);
          } else {
            clearStoredTokens();
            isRefreshing = false;
          }
        } catch {
          clearStoredTokens();
          isRefreshing = false;
        }
      } else {
        return new Promise<T>((resolve, reject) => {
          addRefreshSubscriber((newToken) => {
            const retryHeaders = new Headers(options.headers || {});
            retryHeaders.set("Authorization", `Bearer ${newToken}`);
            request<T>(endpoint, { ...options, headers: retryHeaders }, true)
              .then(resolve)
              .catch(reject);
          });
        });
      }
    }
  }

  // Parse response
  if (!response.ok) {
    let errorDetail = "An error occurred";
    let errorCode: string | undefined;
    try {
      const errorJson: ApiError = await response.json();
      errorDetail = errorJson.message || errorJson.errorCode || `Error ${response.status}`;
      errorCode = errorJson.errorCode;
    } catch {
      errorDetail = response.statusText || `HTTP ${response.status}`;
    }
    throw new ApiClientError(errorDetail, response.status, errorCode);
  }

  // Handle empty or void responses (like 204 or void success)
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return (await response.json()) as T;
  }

  return {} as T;
}

async function requestBlob(
  endpoint: string,
  options: RequestInit = {}
): Promise<Blob> {
  const url = resolveUrl(endpoint);
  const headers = new Headers(options.headers || {});
  const token = getStoredAccessToken();
  if (token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  let response: Response;
  try {
    response = await fetch(url, {
      ...options,
      headers,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Network error";
    throw new ApiClientError(
      `Cannot connect to CampusOS backend service at ${API_BASE_URL}. (${message})`,
      0
    );
  }

  if (!response.ok) {
    let errorDetail = "An error occurred";
    let errorCode: string | undefined;
    try {
      const errorJson: ApiError = await response.json();
      errorDetail = errorJson.message || errorJson.errorCode || `Error ${response.status}`;
      errorCode = errorJson.errorCode;
    } catch {
      errorDetail = response.statusText || `HTTP ${response.status}`;
    }
    throw new ApiClientError(errorDetail, response.status, errorCode);
  }

  return response.blob();
}

export const api = {
  // Authentication
  auth: {
    login: (data: LoginRequest) =>
      request<ApiResponse<AuthResponse>>("/api/v1/auth/login", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    register: (data: RegisterRequest) =>
      request<ApiResponse<UserProfile>>("/api/v1/auth/register", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    me: () => request<ApiResponse<UserProfile>>("/api/v1/auth/me"),
    refresh: (data: RefreshTokenRequest) =>
      request<ApiResponse<AuthResponse>>("/api/v1/auth/refresh", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    logout: (data?: RefreshTokenRequest) =>
      request<ApiResponse<void>>("/api/v1/auth/logout", {
        method: "POST",
        body: data ? JSON.stringify(data) : undefined,
      }),
    changePassword: (data: ChangePasswordRequest) =>
      request<ApiResponse<void>>("/api/v1/auth/change-password", {
        method: "POST",
        body: JSON.stringify(data),
      }),
  },

  // Events
  events: {
    search: (params?: {
      clubId?: string;
      category?: string;
      search?: string;
      fromTime?: string;
      toTime?: string;
      page?: number;
      size?: number;
      sort?: string[];
    }) => {
      const q = new URLSearchParams();
      if (params?.clubId) q.append("clubId", params.clubId);
      if (params?.category) q.append("category", params.category);
      if (params?.search) q.append("search", params.search);
      if (params?.fromTime) q.append("fromTime", params.fromTime);
      if (params?.toTime) q.append("toTime", params.toTime);
      q.append("page", String(params?.page ?? 0));
      q.append("size", String(params?.size ?? 12));
      return request<ApiResponse<PagedResponse<EventItem>>>(`/api/v1/events?${q.toString()}`);
    },
    getById: (id: string) => request<ApiResponse<EventItem>>(`/api/v1/events/${id}`),
    getCalendar: (start: string, end: string) => {
      const q = new URLSearchParams({ start, end });
      return request<ApiResponse<EventItem[]>>(`/api/v1/events/calendar?${q.toString()}`);
    },
    create: (data: CreateEventRequest) =>
      request<ApiResponse<EventItem>>("/api/v1/events", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    update: (id: string, data: UpdateEventRequest) =>
      request<ApiResponse<EventItem>>(`/api/v1/events/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    submitForApproval: (id: string) =>
      request<ApiResponse<EventItem>>(`/api/v1/events/${id}/submit`, { method: "POST" }),
    review: (id: string, decision: EventApprovalDecisionRequest) =>
      request<ApiResponse<EventItem>>(`/api/v1/events/${id}/review`, {
        method: "POST",
        body: JSON.stringify(decision),
      }),
    publish: (id: string) =>
      request<ApiResponse<EventItem>>(`/api/v1/events/${id}/publish`, { method: "POST" }),
    complete: (id: string) =>
      request<ApiResponse<EventItem>>(`/api/v1/events/${id}/complete`, { method: "POST" }),
    cancel: (id: string, reason?: string) => {
      const q = reason ? `?reason=${encodeURIComponent(reason)}` : "";
      return request<ApiResponse<EventItem>>(`/api/v1/events/${id}/cancel${q}`, {
        method: "POST",
      });
    },
    getPendingApprovals: (page = 0, size = 10) =>
      request<ApiResponse<PagedResponse<EventItem>>>(
        `/api/v1/events/pending-approvals?page=${page}&size=${size}`
      ),
  },

  // Event Registrations
  registrations: {
    register: (eventId: string) =>
      request<ApiResponse<Registration>>(`/api/v1/events/${eventId}/registrations`, {
        method: "POST",
      }),
    cancel: (eventId: string) =>
      request<ApiResponse<Registration>>(`/api/v1/events/${eventId}/registrations`, {
        method: "DELETE",
      }),
    getMyRegistrations: (page = 0, size = 10) =>
      request<ApiResponse<PagedResponse<Registration>>>(
        `/api/v1/registrations/my?page=${page}&size=${size}`
      ),
    getEventAttendees: (eventId: string, page = 0, size = 20) =>
      request<ApiResponse<PagedResponse<Registration>>>(
        `/api/v1/events/${eventId}/registrations?page=${page}&size=${size}`
      ),
  },

  // Clubs
  clubs: {
    search: (params?: { category?: string; search?: string; page?: number; size?: number }) => {
      const q = new URLSearchParams();
      if (params?.category) q.append("category", params.category);
      if (params?.search) q.append("search", params.search);
      q.append("page", String(params?.page ?? 0));
      q.append("size", String(params?.size ?? 12));
      return request<ApiResponse<PagedResponse<ClubItem>>>(`/api/v1/clubs?${q.toString()}`);
    },
    getById: (id: string) => request<ApiResponse<ClubItem>>(`/api/v1/clubs/${id}`),
    getBySlug: (slug: string) => request<ApiResponse<ClubItem>>(`/api/v1/clubs/slug/${slug}`),
    create: (data: CreateClubRequest) =>
      request<ApiResponse<ClubItem>>("/api/v1/clubs", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    update: (id: string, data: UpdateClubRequest) =>
      request<ApiResponse<ClubItem>>(`/api/v1/clubs/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    getMembers: (id: string, page = 0, size = 20) =>
      request<ApiResponse<PagedResponse<ClubMember>>>(
        `/api/v1/clubs/${id}/members?page=${page}&size=${size}`
      ),
    addMember: (clubId: string, data: AssignClubMemberRequest) =>
      request<ApiResponse<ClubMember>>(`/api/v1/clubs/${clubId}/members`, {
        method: "POST",
        body: JSON.stringify(data),
      }),
    removeMember: (clubId: string, userId: string) =>
      request<ApiResponse<void>>(`/api/v1/clubs/${clubId}/members/${userId}`, {
        method: "DELETE",
      }),
  },

  // Campus Voice
  campusVoice: {
    search: (params?: {
      category?: string;
      clubId?: string;
      search?: string;
      page?: number;
      size?: number;
    }) => {
      const q = new URLSearchParams();
      if (params?.category) q.append("category", params.category);
      if (params?.clubId) q.append("clubId", params.clubId);
      if (params?.search) q.append("search", params.search);
      q.append("page", String(params?.page ?? 0));
      q.append("size", String(params?.size ?? 12));
      return request<ApiResponse<PagedResponse<CampusVoicePost>>>(
        `/api/v1/campus-voice?${q.toString()}`
      );
    },
    getById: (id: string) => request<ApiResponse<CampusVoicePost>>(`/api/v1/campus-voice/${id}`),
    createPost: (data: CreatePostRequest) =>
      request<ApiResponse<CampusVoicePost>>("/api/v1/campus-voice", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    toggleReaction: (id: string, reactionType = "LIKE") =>
      request<ApiResponse<void>>(`/api/v1/campus-voice/${id}/react`, {
        method: "POST",
        body: JSON.stringify({ reactionType }),
      }),
    getComments: (id: string, page = 0, size = 20) =>
      request<ApiResponse<PagedResponse<CampusVoiceComment>>>(
        `/api/v1/campus-voice/${id}/comments?page=${page}&size=${size}`
      ),
    addComment: (id: string, data: CreateCommentRequest) =>
      request<ApiResponse<CampusVoiceComment>>(`/api/v1/campus-voice/${id}/comments`, {
        method: "POST",
        body: JSON.stringify(data),
      }),
    report: (id: string, data: ReportPostRequest) =>
      request<ApiResponse<unknown>>(`/api/v1/campus-voice/${id}/report`, {
        method: "POST",
        body: JSON.stringify(data),
      }),
    moderate: (id: string, status: string, moderationReason?: string) =>
      request<ApiResponse<CampusVoicePost>>(`/api/v1/campus-voice/${id}/moderate`, {
        method: "POST",
        body: JSON.stringify({ status, moderationReason }),
      }),
    getPendingModeration: (page = 0, size = 10) =>
      request<ApiResponse<PagedResponse<CampusVoicePost>>>(
        `/api/v1/campus-voice/pending-moderation?page=${page}&size=${size}`
      ),
  },

  // Certificates
  certificates: {
    verify: (verificationCode: string) =>
      request<ApiResponse<PublicCertificateVerification>>(
        `/api/v1/certificates/verify/${verificationCode}`
      ),
    getMyCertificates: (page = 0, size = 10) =>
      request<ApiResponse<PagedResponse<Certificate>>>(
        `/api/v1/certificates/my?page=${page}&size=${size}`
      ),
    downloadPdfBlob: (id: string) =>
      requestBlob(`/api/v1/certificates/${id}/download`),
    downloadPdfUrl: (id: string) => `${API_SERVER_ORIGIN}/api/v1/certificates/${id}/download`,
    getTemplatesForClub: (clubId: string) =>
      request<ApiResponse<CertificateTemplateResponse[]>>(
        `/api/v1/certificates/templates/clubs/${clubId}`
      ),
    getTemplate: (id: string) =>
      request<ApiResponse<CertificateTemplateResponse>>(
        `/api/v1/certificates/templates/${id}`
      ),
    createTemplate: (formData: FormData) =>
      request<ApiResponse<CertificateTemplateResponse>>(`/api/v1/certificates/templates`, {
        method: "POST",
        body: formData,
      }),
    updateTemplate: (id: string, data: UpdateCertificateTemplateRequest) =>
      request<ApiResponse<CertificateTemplateResponse>>(`/api/v1/certificates/templates/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    deleteTemplate: (id: string) =>
      request<ApiResponse<void>>(`/api/v1/certificates/templates/${id}`, {
        method: "DELETE",
      }),
    previewTemplate: (templateId: string, data?: CertificatePreviewRequest) =>
      requestBlob(`/api/v1/certificates/templates/${templateId}/preview`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: data ? JSON.stringify(data) : undefined,
      }),
    previewTransient: (data: CertificatePreviewRequest) =>
      requestBlob(`/api/v1/certificates/templates/preview`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }),
    getBulkIssuePreview: (eventId: string) =>
      request<ApiResponse<BulkIssuePreviewResponse>>(
        `/api/v1/certificates/events/${eventId}/bulk-preview`
      ),
    bulkIssue: (eventId: string, data?: BulkIssueRequest) =>
      request<ApiResponse<BulkIssueResponse>>(`/api/v1/certificates/events/${eventId}/bulk`, {
        method: "POST",
        body: JSON.stringify(data || {}),
      }),
    getBatchStatus: (batchId: string) =>
      request<ApiResponse<BatchDeliveryStatusResponse>>(
        `/api/v1/certificates/batches/${batchId}`
      ),
    retryFailed: (batchId: string) =>
      request<ApiResponse<BatchDeliveryStatusResponse>>(
        `/api/v1/certificates/batches/${batchId}/retry-failed`,
        {
          method: "POST",
        }
      ),
    issue: (eventId: string, userId: string) =>
      request<ApiResponse<Certificate>>(`/api/v1/certificates/events/${eventId}/users/${userId}`, {
        method: "POST",
      }),
    revoke: (id: string, reason?: string) => {
      const q = reason ? `?reason=${encodeURIComponent(reason)}` : "";
      return request<ApiResponse<Certificate>>(`/api/v1/certificates/${id}/revoke${q}`, {
        method: "POST",
      });
    },
  },

  // Recruitment
  recruitment: {
    getOpenDrives: (page = 0, size = 10) =>
      request<ApiResponse<PagedResponse<RecruitmentDrive>>>(
        `/api/v1/recruitment/drives/open?page=${page}&size=${size}`
      ),
    getDrivesForClub: (clubId: string, page = 0, size = 10) =>
      request<ApiResponse<PagedResponse<RecruitmentDrive>>>(
        `/api/v1/recruitment/clubs/${clubId}/drives?page=${page}&size=${size}`
      ),
    getPositionsForDrive: (driveId: string) =>
      request<ApiResponse<RecruitmentPosition[]>>(
        `/api/v1/recruitment/drives/${driveId}/positions`
      ),
    submitApplication: (data: SubmitApplicationRequest) =>
      request<ApiResponse<RecruitmentApplication>>("/api/v1/recruitment/applications", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    getMyApplications: (page = 0, size = 10) =>
      request<ApiResponse<PagedResponse<RecruitmentApplication>>>(
        `/api/v1/recruitment/applications/my?page=${page}&size=${size}`
      ),
    createDrive: (data: {
      clubId: string;
      title: string;
      description?: string;
      academicYear: string;
      startDate: string;
      endDate: string;
    }) =>
      request<ApiResponse<RecruitmentDrive>>("/api/v1/recruitment/drives", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    createPosition: (data: {
      driveId: string;
      title: string;
      description?: string;
      requirements?: string;
      openings?: number;
    }) =>
      request<ApiResponse<RecruitmentPosition>>("/api/v1/recruitment/positions", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    openDrive: (id: string) =>
      request<ApiResponse<RecruitmentDrive>>(`/api/v1/recruitment/drives/${id}/open`, {
        method: "POST",
      }),
    closeDrive: (id: string) =>
      request<ApiResponse<RecruitmentDrive>>(`/api/v1/recruitment/drives/${id}/close`, {
        method: "POST",
      }),
    getDriveApplications: (driveId: string, page = 0, size = 20) =>
      request<ApiResponse<PagedResponse<RecruitmentApplication>>>(
        `/api/v1/recruitment/drives/${driveId}/applications?page=${page}&size=${size}`
      ),
    reviewApplication: (
      id: string,
      data: {
        status: string;
        interviewTime?: string;
        interviewVenue?: string;
        reviewerNotes?: string;
      }
    ) =>
      request<ApiResponse<RecruitmentApplication>>(`/api/v1/recruitment/applications/${id}/review`, {
        method: "POST",
        body: JSON.stringify(data),
      }),
  },

  // Attendance
  attendance: {
    startSession: (eventId: string, durationMinutes = 60) =>
      request<ApiResponse<AttendanceSession>>("/api/v1/attendance/sessions", {
        method: "POST",
        body: JSON.stringify({ eventId, durationMinutes }),
      }),
    checkIn: (token: string) =>
      request<ApiResponse<AttendanceRecord>>("/api/v1/attendance/check-in", {
        method: "POST",
        body: JSON.stringify({ token }),
      }),
    markManual: (eventId: string, userId: string, reason: string) =>
      request<ApiResponse<AttendanceRecord>>(`/api/v1/attendance/manual/${eventId}`, {
        method: "POST",
        body: JSON.stringify({ userId, reason }),
      }),
    getStats: (eventId: string) =>
      request<ApiResponse<AttendanceStats>>(`/api/v1/attendance/events/${eventId}/stats`),
    getRecords: (eventId: string, page = 0, size = 20) =>
      request<ApiResponse<PagedResponse<AttendanceRecord>>>(
        `/api/v1/attendance/events/${eventId}/records?page=${page}&size=${size}`
      ),
  },

  // Venues
  venues: {
    getAll: (page = 0, size = 20) =>
      request<ApiResponse<PagedResponse<Venue>>>(`/api/v1/venues?page=${page}&size=${size}`),
    getById: (id: string) => request<ApiResponse<Venue>>(`/api/v1/venues/${id}`),
    checkAvailability: (id: string, startTime: string, endTime: string, excludeEventId?: string) => {
      const q = new URLSearchParams({ startTime, endTime });
      if (excludeEventId) q.append("excludeEventId", excludeEventId);
      return request<ApiResponse<boolean>>(`/api/v1/venues/${id}/availability?${q.toString()}`);
    },
    create: (data: {
      name: string;
      building: string;
      capacity: number;
      hasProjector?: boolean;
      hasAudioSystem?: boolean;
    }) =>
      request<ApiResponse<Venue>>("/api/v1/venues", {
        method: "POST",
        body: JSON.stringify(data),
      }),
  },

  // Recommendations
  recommendations: {
    get: (limit = 6) =>
      request<ApiResponse<RecommendationItem[]>>(`/api/v1/recommendations?limit=${limit}`),
  },

  // Notifications
  notifications: {
    getMyNotifications: (page = 0, size = 15) =>
      request<ApiResponse<PagedResponse<NotificationItem>>>(
        `/api/v1/notifications?page=${page}&size=${size}`
      ),
    getUnreadCount: () =>
      request<ApiResponse<{ count?: number; [key: string]: unknown }>>(
        "/api/v1/notifications/unread-count"
      ),
    markAsRead: (id: string) =>
      request<ApiResponse<void>>(`/api/v1/notifications/${id}/read`, { method: "PATCH" }),
    markAllAsRead: () =>
      request<ApiResponse<void>>("/api/v1/notifications/mark-all-read", { method: "POST" }),
    broadcast: (data: { title: string; message: string; linkUrl?: string }) =>
      request<ApiResponse<unknown>>("/api/v1/notifications/broadcast", {
        method: "POST",
        body: JSON.stringify(data),
      }),
  },

  // Analytics
  analytics: {
    getCampusAnalytics: () =>
      request<ApiResponse<CampusAnalytics>>("/api/v1/analytics/campus"),
    getClubAnalytics: (clubId: string) =>
      request<ApiResponse<ClubAnalytics>>(`/api/v1/analytics/clubs/${clubId}`),
  },

  // Role Access Requests
  accessRequests: {
    getMyRequests: (page = 0, size = 10) =>
      request<ApiResponse<PagedResponse<RoleAccessRequest>>>(
        `/api/v1/access-requests/my?page=${page}&size=${size}`
      ),
    createRequest: (data: {
      requestedRole: UserRole;
      targetClubId?: string;
      justification: string;
    }) =>
      request<ApiResponse<RoleAccessRequest>>("/api/v1/access-requests", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    getAllRequests: (status?: string, page = 0, size = 10) => {
      const q = new URLSearchParams();
      if (status) q.append("status", status);
      q.append("page", String(page));
      q.append("size", String(size));
      return request<ApiResponse<PagedResponse<RoleAccessRequest>>>(
        `/api/v1/access-requests?${q.toString()}`
      );
    },
    reviewRequest: (id: string, approved: boolean, reviewNotes?: string) =>
      request<ApiResponse<RoleAccessRequest>>(`/api/v1/access-requests/${id}/review`, {
        method: "POST",
        body: JSON.stringify({ approved, reviewNotes }),
      }),
  },

  // Users (Self & Admin)
  users: {
    getMe: () => request<ApiResponse<UserProfile>>("/api/v1/users/me"),
    updateMe: (data: UpdateProfileRequest) =>
      request<ApiResponse<UserProfile>>("/api/v1/users/me", {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    getAll: (page = 0, size = 20) =>
      request<ApiResponse<PagedResponse<UserProfile>>>(`/api/v1/users?page=${page}&size=${size}`),
    search: (query?: string, page = 0, size = 20) => {
      const q = new URLSearchParams();
      if (query) q.append("query", query);
      q.append("page", String(page));
      q.append("size", String(size));
      return request<ApiResponse<PagedResponse<UserProfile>>>(
        `/api/v1/users/search?${q.toString()}`
      );
    },
    assignRole: (userId: string, role: UserRole) =>
      request<ApiResponse<UserProfile>>(`/api/v1/users/${userId}/roles?role=${role}`, {
        method: "POST",
      }),
    removeRole: (userId: string, role: UserRole) =>
      request<ApiResponse<UserProfile>>(`/api/v1/users/${userId}/roles/${role}`, {
        method: "DELETE",
      }),
  },

  // Backend System Health Monitoring
  health: {
    check: async (timeoutMs = 7000): Promise<boolean> => {
      // Primary: Actuator health endpoint
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
        const res = await fetch(`${API_SERVER_ORIGIN}/actuator/health`, {
          cache: "no-store",
          signal: controller.signal,
        });
        clearTimeout(timeoutId);
        if (res.ok) {
          const data = await res.json().catch(() => null);
          if (data?.status === "UP") return true;
        }
      } catch {
        // Fallback to public API probe below
      }

      // Secondary fallback: Probe public events endpoint
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
        const res = await fetch(`${API_SERVER_ORIGIN}/api/v1/events?page=0&size=1`, {
          cache: "no-store",
          signal: controller.signal,
        });
        clearTimeout(timeoutId);
        return res.ok;
      } catch {
        return false;
      }
    },
  },
};

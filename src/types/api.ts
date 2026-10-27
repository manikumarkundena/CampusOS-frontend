/**
 * CampusOS Authentic TypeScript Schema
 * Strictly matches Spring Boot backend OpenAPI specification
 */

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

export interface PagedResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

export type UserRole = "STUDENT" | "CLUB_ADMIN" | "FACULTY_COORDINATOR" | "SUPER_ADMIN";

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  studentId?: string;
  department?: string;
  graduationYear?: number;
  phone?: string;
  bio?: string;
  interests?: string;
  roles: UserRole[];
  active?: boolean;
  createdAt?: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresInMs: number;
  user: UserProfile;
}

export interface RegisterRequest {
  email: string;
  password: string;
  fullName: string;
  studentId?: string;
  department?: string;
  graduationYear?: number;
  phone?: string;
  interests?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface UpdateProfileRequest {
  fullName: string;
  studentId?: string;
  department?: string;
  graduationYear?: number;
  phone?: string;
  bio?: string;
  interests?: string;
}

export type EventStatus =
  | "DRAFT"
  | "SUBMITTED_FOR_APPROVAL"
  | "CHANGES_REQUESTED"
  | "APPROVED"
  | "PUBLISHED"
  | "REJECTED"
  | "CANCELLED"
  | "COMPLETED";

export interface EventItem {
  id: string;
  clubId: string;
  clubName?: string;
  clubSlug?: string;
  title: string;
  description?: string;
  category: string;
  tags?: string;
  startTime: string;
  endTime: string;
  displayTimezone?: string;
  venueId?: string;
  venueName?: string;
  capacity: number;
  registrationStart?: string;
  registrationEnd?: string;
  feeAmount?: number;
  status: EventStatus;
  posterUrl?: string;
  createdById?: string;
  approvalReviewerId?: string;
  approvalComment?: string;
  approvalDecidedAt?: string;
  createdAt?: string;
  registrationRequired?: boolean;
  paid?: boolean;
}

export interface CreateEventRequest {
  clubId: string;
  title: string;
  description?: string;
  category: string;
  tags?: string;
  startTime: string;
  endTime: string;
  displayTimezone?: string;
  venueId?: string;
  capacity: number;
  registrationStart?: string;
  registrationEnd?: string;
  isRegistrationRequired?: boolean;
  isPaid?: boolean;
  feeAmount?: number;
  posterUrl?: string;
}

export interface UpdateEventRequest {
  title?: string;
  description?: string;
  category?: string;
  tags?: string;
  startTime?: string;
  endTime?: string;
  displayTimezone?: string;
  venueId?: string;
  capacity?: number;
  registrationStart?: string;
  registrationEnd?: string;
  isRegistrationRequired?: boolean;
  isPaid?: boolean;
  feeAmount?: number;
  posterUrl?: string;
}

export interface EventApprovalDecisionRequest {
  decision: "APPROVE" | "REJECT" | "REQUEST_CHANGES";
  comment?: string;
}

export interface ClubItem {
  id: string;
  name: string;
  slug: string;
  description?: string;
  category?: string;
  facultyCoordinatorId?: string;
  facultyCoordinatorName?: string;
  logoUrl?: string;
  bannerUrl?: string;
  active?: boolean;
  memberCount?: number;
  createdAt?: string;
}

export interface CreateClubRequest {
  name: string;
  slug: string;
  description?: string;
  category?: string;
  facultyCoordinatorId?: string;
  logoUrl?: string;
  bannerUrl?: string;
}

export interface UpdateClubRequest {
  name?: string;
  description?: string;
  category?: string;
  facultyCoordinatorId?: string;
  logoUrl?: string;
  bannerUrl?: string;
  active?: boolean;
}

export interface ClubMember {
  id: string;
  clubId: string;
  clubName?: string;
  userId: string;
  userFullName?: string;
  userEmail?: string;
  roleInClub?: string;
  clubAdmin?: boolean;
  joinedAt?: string;
}

export interface AssignClubMemberRequest {
  userId: string;
  roleInClub?: string;
  isClubAdmin?: boolean;
}

export type RegistrationStatus = "CONFIRMED" | "CANCELLED" | "WAITLISTED";
export type PaymentStatus = "NOT_REQUIRED" | "PENDING" | "COMPLETED" | "FAILED";

export interface Registration {
  id: string;
  eventId: string;
  eventTitle?: string;
  eventStartTime?: string;
  eventEndTime?: string;
  venueName?: string;
  userId: string;
  userFullName?: string;
  userEmail?: string;
  studentId?: string;
  status: RegistrationStatus;
  paymentStatus: PaymentStatus;
  registeredAt?: string;
  cancelledAt?: string;
}

export type PostStatus = "DRAFT" | "SUBMITTED" | "PUBLISHED" | "REJECTED" | "REMOVED";

export interface CampusVoicePost {
  id: string;
  title: string;
  content: string;
  category?: string;
  status: PostStatus;
  authorId?: string;
  authorName?: string;
  clubId?: string;
  clubName?: string;
  reactionCount?: number;
  commentCount?: number;
  createdAt?: string;
}

export interface CampusVoiceComment {
  id: string;
  postId: string;
  authorId?: string;
  authorName?: string;
  content: string;
  createdAt?: string;
}

export interface CreatePostRequest {
  title: string;
  content: string;
  category?: string;
  clubId?: string;
}

export interface CreateCommentRequest {
  content: string;
}

export interface ReportPostRequest {
  reason: string;
  details?: string;
}

export interface Certificate {
  id: string;
  eventId: string;
  eventTitle?: string;
  clubName?: string;
  userId: string;
  recipientName?: string;
  recipientEmail?: string;
  studentId?: string;
  certificateNumber?: string;
  verificationCode?: string;
  issuedAt?: string;
  revoked?: boolean;
  revocationReason?: string;
}

export interface PublicCertificateVerification {
  certificateNumber?: string;
  verificationCode?: string;
  recipientName?: string;
  eventTitle?: string;
  clubName?: string;
  issuedAt?: string;
  valid?: boolean;
  revocationReason?: string;
}

export type RecruitmentDriveStatus = "DRAFT" | "OPEN" | "CLOSED" | "ARCHIVED";
export type ApplicationStatus =
  | "APPLIED"
  | "SHORTLISTED"
  | "INTERVIEW_SCHEDULED"
  | "ACCEPTED"
  | "REJECTED"
  | "WAITLISTED";

export interface RecruitmentDrive {
  id: string;
  clubId: string;
  clubName?: string;
  title: string;
  description?: string;
  academicYear: string;
  startDate: string;
  endDate: string;
  status: RecruitmentDriveStatus;
  createdAt?: string;
}

export interface RecruitmentPosition {
  id: string;
  driveId: string;
  driveTitle?: string;
  clubName?: string;
  title: string;
  description?: string;
  requirements?: string;
  openings?: number;
  active?: boolean;
  createdAt?: string;
}

export interface RecruitmentApplication {
  id: string;
  positionId: string;
  positionTitle?: string;
  driveId?: string;
  driveTitle?: string;
  clubName?: string;
  applicantId?: string;
  applicantName?: string;
  applicantEmail?: string;
  studentId?: string;
  statementOfPurpose: string;
  resumeUrl?: string;
  status: ApplicationStatus;
  interviewTime?: string;
  interviewVenue?: string;
  reviewerNotes?: string;
  appliedAt?: string;
  updatedAt?: string;
}

export interface SubmitApplicationRequest {
  positionId: string;
  statementOfPurpose: string;
  resumeUrl?: string;
}

export interface Venue {
  id: string;
  name: string;
  building: string;
  capacity: number;
  hasProjector?: boolean;
  hasAudioSystem?: boolean;
  active?: boolean;
  createdAt?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type?: string;
  linkUrl?: string;
  read: boolean;
  readAt?: string;
  createdAt?: string;
}

export interface RecommendationItem {
  eventId: string;
  title: string;
  category?: string;
  clubName?: string;
  startTime?: string;
  endTime?: string;
  venueName?: string;
  score?: number;
  explanation?: string;
  posterUrl?: string;
}

export interface CampusAnalytics {
  totalClubs?: number;
  totalEvents?: number;
  publishedEvents?: number;
  completedEvents?: number;
  totalRegistrations?: number;
  totalVerifiedAttendees?: number;
  overallAttendanceRate?: number;
  totalCertificatesIssued?: number;
  totalRecruitmentDrives?: number;
  totalRecruitmentApplications?: number;
  totalCampusVoicePosts?: number;
}

export interface ClubAnalytics {
  clubId: string;
  clubName?: string;
  memberCount?: number;
  totalEvents?: number;
  totalRegistrations?: number;
  totalAttendees?: number;
  attendanceRate?: number;
  recruitmentDriveCount?: number;
}

export interface RoleAccessRequest {
  id: string;
  userId: string;
  userEmail?: string;
  userFullName?: string;
  requestedRole: UserRole;
  targetClubId?: string;
  targetClubName?: string;
  justification: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  reviewedBy?: string;
  reviewerEmail?: string;
  reviewedAt?: string;
  reviewNotes?: string;
  createdAt?: string;
}

export interface AttendanceSession {
  id: string;
  eventId: string;
  eventTitle?: string;
  sessionCode?: string;
  qrPayload?: string;
  expiresAt?: string;
  active?: boolean;
  createdAt?: string;
}

export interface AttendanceRecord {
  id: string;
  eventId: string;
  eventTitle?: string;
  userId: string;
  userFullName?: string;
  userEmail?: string;
  studentId?: string;
  verificationMethod: "QR_SCAN" | "MANUAL_CORRECTION";
  markedAt?: string;
  verifiedByName?: string;
  correctionReason?: string;
}

export interface AttendanceStats {
  eventId: string;
  eventTitle?: string;
  totalRegistered: number;
  totalAttended: number;
  attendanceRate: number;
}

export interface ApiError {
  timestamp?: string | number;
  status?: number;
  errorCode?: string;
  message?: string;
  path?: string;
}

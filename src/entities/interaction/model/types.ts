/* ======================================================
 * ENUMS
 * ====================================================== */

export enum TargetType {
  POST = 'POST',
  COMMENT = 'COMMENT',
  TOPIC = 'TOPIC',
}

export enum ReportReason {
  SPAM = 'SPAM',
  HARASSMENT = 'HARASSMENT',
  HATE_SPEECH = 'HATE_SPEECH',
  FALSE_INFORMATION = 'FALSE_INFORMATION',
  SEXUAL_CONTENT = 'SEXUAL_CONTENT',
  VIOLENCE = 'VIOLENCE',
  UNAUTHORIZED_SALES = 'UNAUTHORIZED_SALES',
  OTHER = 'OTHER',
}

export enum ReportStatus {
  PENDING = 'PENDING',
  RESOLVED = 'RESOLVED',
  REJECTED = 'REJECTED',
}

/* ======================================================
 * COMMON / SHARED
 * ====================================================== */

export interface UserSummary {
  id: string;
  fullName?: string;
  avatarUrl?: string;
  email?: string;
}

/* ======================================================
 * POST
 * ====================================================== */

export interface PostPermissions {
  canEdit: boolean;
  canDelete: boolean;
  canReport: boolean;
}

export interface PostStats {
  viewCount: number;
  commentCount: number;
  reactionCount?: number;
}

export interface PostAttachment {
  id: string;
  name?: string;
  url: string;
  type?: string;
}

export interface Post {
  id: string;
  title: string;
  content: string;

  author?: UserSummary;

  topicId?: string;
  topicName?: string;

  createdDateTime?: string;
  updatedDateTime?: string;

  deleted?: boolean;

  stats?: PostStats;
  permissions?: PostPermissions;

  attachments?: PostAttachment[];
}

/* ======================================================
 * COMMENT
 * ====================================================== */

export interface CommentPermissions {
  canEdit: boolean;
  canDelete: boolean;
  canReport: boolean;
}

export interface Comment {
  id: string;
  content: string;

  author?: UserSummary;

  postId: string;

  parentId?: string | null;
  rootCommentId?: string | null;
  replyToUser?: UserSummary | null;

  createdDateTime?: string;
  updatedDateTime?: string;

  deleted?: boolean;

  permissions?: CommentPermissions;

  reactionCount?: number;
  repliesCount?: number;
  isLiked?: boolean;

  children?: Comment[];
  _debugRaw?: unknown;
}

/* ======================================================
 * REPORT
 * ====================================================== */

export interface Report {
  id: string;

  reporterId: string;

  targetType: TargetType;

  postId?: string | null;
  commentId?: string | null;

  reason: ReportReason;
  description?: string;

  status: ReportStatus;

  targetPreview?: string;

  createdAt: string;

  processedById?: string | null;
  processedAt?: string | null;
}

/* ======================================================
 * REQUEST DTOs (Frontend)
 * ====================================================== */

export interface ReportRequest {
  targetType: TargetType;
  targetId: string;
  reason: ReportReason;
  description?: string;
}

export interface ProcessReportRequest {
  status: ReportStatus;
  adminNote?: string;
  deleteTarget?: boolean;
}

/* ======================================================
 * UI LABELS
 * ====================================================== */

export const REPORT_REASON_LABELS: Record<ReportReason, string> = {
  [ReportReason.SPAM]: 'Spam / Quảng cáo',
  [ReportReason.HARASSMENT]: 'Quấy rối / Công kích cá nhân',
  [ReportReason.HATE_SPEECH]: 'Ngôn từ thù ghét',
  [ReportReason.FALSE_INFORMATION]: 'Tin giả / Sai sự thật',
  [ReportReason.SEXUAL_CONTENT]: 'Nội dung đồi trụy',
  [ReportReason.VIOLENCE]: 'Bạo lực',
  [ReportReason.UNAUTHORIZED_SALES]: 'Bán hàng trái phép',
  [ReportReason.OTHER]: 'Lý do khác',
};

// 1. Author Response
export interface CommentAuthor {
  id: string;
  fullName: string;
  avatarUrl: string;
}

// 2. Stats
export interface CommentStats {
  reactionCount: number;
  replyCount?: number;
}

// 3. User State
export interface CommentUserState {
  liked: boolean;
}

// 5. Attachments
export interface CommentAttachment {
  id: string;
  url: string;
  name: string;
  type: string;
  size: number;
}

export interface CreateCommentPayload {
  postId: string;
  content: string;
  parentId?: string | null;
}

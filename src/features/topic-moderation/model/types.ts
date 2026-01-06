export enum ReportStatus {
  PENDING = 'PENDING',
  RESOLVED = 'RESOLVED',
  REJECTED = 'REJECTED',
}

export enum ReportReason {
  SPAM = 'SPAM',
  INAPPROPRIATE_CONTENT = 'INAPPROPRIATE_CONTENT',
  HARASSMENT = 'HARASSMENT',
  HATE_SPEECH = 'HATE_SPEECH',
  OTHER = 'OTHER',
}

export enum ReportAction {
  DELETE_CONTENT = 'DELETE_CONTENT',
  KEEP_CONTENT = 'KEEP_CONTENT',
  WARN_USER = 'WARN_USER',
}

export interface ReportDTO {
  id: string;
  reporterId: string;
  reporterFullName: string;
  reporterAvatarUrl?: string;
  reason: ReportReason;
  description?: string;
  status: ReportStatus;
  targetType: 'POST' | 'COMMENT';

  // Target IDs for linking
  postId?: string;
  commentId?: string;

  // Preview content (from backend mapToResponse)
  targetPreview?: string;

  createdAt: string;
}

export interface ProcessReportRequest {
  action: ReportAction;
  note?: string;
}

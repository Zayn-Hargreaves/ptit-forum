export enum AnnouncementType {
  GENERAL = "GENERAL",
  CLASS_MEETING = "CLASS_MEETING",
  PAY_FEE = "PAY_FEE",
}

export const ANNOUNCEMENT_TYPE_LABEL: Record<AnnouncementType, string> = {
  [AnnouncementType.GENERAL]: "Thông báo chung",
  [AnnouncementType.CLASS_MEETING]: "Họp lớp",
  [AnnouncementType.PAY_FEE]: "Học phí",
};

export interface BackendAnnouncement {
  id: string;
  title: string;
  content: string;
  announcementType: AnnouncementType;
  announcementStatus: boolean;
  createdBy: string | null;
  createdDate: string;
  modifiedBy: string | null;
  modifiedDate: string | null;
}

export interface ApiResponse<T> {
  code: number;
  message: string | null;
  result: T;
}

export interface Announcement {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  type: AnnouncementType;
  date: string;
  author: string;
}

export interface FetchAnnouncementsParams {
  page?: number;
  size?: number;
  keyword?: string;
  type?: AnnouncementType[];
  fromDate?: string;
  toDate?: string;
}

export interface FileAttachment {
  id: string;
  fileName: string;
  url: string;
  size: number;
  contentType: string;
  type?: string;
}

export interface BackendAnnouncementDetail {
  id: string;
  title: string;
  content: string;
  announcementType: AnnouncementType;
  announcementStatus: boolean;
  createdByFullName: string | null;
  // createdByAvatar?: string;
  createdDate: string;
  modifiedDate: string | null;

  announcementTargetResponses: any[];
  attachments: FileAttachment[];

  // views?: number;
}

export interface AnnouncementDetail {
  id: string;
  title: string;
  content: string;
  category: string;
  type: AnnouncementType;
  author: string;
  avatarUrl?: string;
  date: string;
  views: number;
  attachments: FileAttachment[];
}

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

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
  first: boolean;
  last: boolean;
  empty: boolean;
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

export interface BackendAnnouncementDetail {
  id: string;
  title: string;
  content: string;
  announcementType: AnnouncementType;
  announcementStatus: boolean;
  createdByFullName: string | null;
  createdDate: string;
  modifiedDate: string | null;
  // Backend hiện tại CHƯA TRẢ VỀ attachments.
  // Nếu sau này có, thêm vào đây: attachments: { url: string, name: string }[]
}

export interface AnnouncementDetail {
  id: string;
  title: string;
  content: string;
  category: string;
  type: AnnouncementType; // Để dùng cho logic related
  author: string;
  avatarUrl?: string; // Backend chưa có, dùng placeholder
  date: string;
  views: number; // Backend chưa có field này, fake hoặc yêu cầu BE thêm
}

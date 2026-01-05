import {CohortCode} from "@shared/api/classroom.service";

export enum AnnouncementType {
  GENERAL = "GENERAL",
  CLASS_MEETING = "CLASS_MEETING",
  PAY_FEE = "PAY_FEE",
  ACADEMIC = "ACADEMIC",
}

export const ANNOUNCEMENT_TYPE_LABEL: Record<AnnouncementType, string> = {
  [AnnouncementType.GENERAL]: "Thông báo chung",
  [AnnouncementType.CLASS_MEETING]: "Họp lớp",
  [AnnouncementType.PAY_FEE]: "Học phí",
    [AnnouncementType.ACADEMIC]: "Học tập"
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
  fileType: string;
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
  attachments: {
    id: string;
    fileName: string;
    url: string;
    fileType: string;
    size: number;
  }[];

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

export interface AnnouncementFileResponse {
    id: string;
    fileName: string;
    fileUrl: string;
    fileType: string;
}

// Tương ứng: AnnouncementResponse
export interface AnnouncementResponse {
    id: string;
    title: string;
    content: string;
    announcementType: AnnouncementType;
    announcementStatus: boolean; // true = released, false = draft
    createdBy: string; // email
    createdDate: string; // LocalDate -> string (ISO)
    modifiedBy: string;
    modifiedDate: string;
}

export interface DetailedAnnouncement extends Announcement {
    attachments: AnnouncementFileResponse[];
}

// --- REQUEST DTOs (Dữ liệu gửi lên BE) ---

// Tương ứng: CreatedAnnouncementRequest
export interface CreateAnnouncementPayload {
    title: string;
    content: string;
    announcementType: AnnouncementType;
    fileMetadataIds: string[]; // List<UUID>
}

// Tương ứng: ReleaseAnnouncementRequest
export interface ReleaseAnnouncementPayload {
    facultyIds: string[];
    classCodes: string[];
    schoolYearCodes: CohortCode[];
}

// Tương ứng: UpdatedAnnouncementRequest
export interface UpdateAnnouncementPayload {
    title: string;
    content: string;
    announcementType: AnnouncementType;
    announcementStatus: boolean;
    facultyIds: string[];
    classCodes: string[];
    schoolYearCodes: CohortCode[];
}

// Tương ứng: SearchAnnouncementRequest
export interface AnnouncementSearchParams {
    page?: number;
    size?: number;
    title?: string;
    type?: AnnouncementType;
    status?: boolean;
    // Thêm các field khác nếu backend hỗ trợ filter
}

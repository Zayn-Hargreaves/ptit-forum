import { cache } from "react";
import { apiClient } from "@shared/api/axios-client";
import { PageResponse } from "@shared/api/types";
import {
  Announcement,
  ANNOUNCEMENT_TYPE_LABEL,
  AnnouncementDetail,
  ApiResponse,
  BackendAnnouncement,
  BackendAnnouncementDetail,
  FetchAnnouncementsParams,
} from "./model/types";

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function fetchAnnouncements(
  params: FetchAnnouncementsParams,
  options?: { headers?: Record<string, string> }
) {
  const pageIndex = params.page && params.page > 0 ? params.page - 1 : 0;

  const { data } = await apiClient.get<
    ApiResponse<PageResponse<BackendAnnouncement>>
  >("/announcements", {
    params: {
      page: pageIndex,
      size: params.size || 10,
      sort: "createdDate,desc",
      keyword: params.keyword,
      type: params.type,
      fromDate: params.fromDate,
      toDate: params.toDate,
    },
    paramsSerializer: {
      indexes: null,
    },
    ...options,
  });

  if (data.code !== 1000) {
    throw new Error(data.message || "Lỗi không xác định từ hệ thống");
  }

  const { result } = data;

  const items: Announcement[] = result.content.map((item) => {
    const plainText = item.content.replaceAll(/<[^>]+>/g, "");
    const excerpt =
      plainText.slice(0, 150) + (plainText.length > 150 ? "..." : "");

    return {
      id: item.id,
      title: item.title,
      excerpt: excerpt,
      category: ANNOUNCEMENT_TYPE_LABEL[item.announcementType] || "Khác",
      type: item.announcementType,
      date: item.createdDate,
      author: item.createdBy || "Admin",
    };
  });

  return {
    items,
    page: result.number + 1,
    size: result.size,
    total: result.totalElements,
    totalPages: result.totalPages,
  };
}

export const getAnnouncementById = cache(async function getAnnouncementById(
  id: string,
  options?: { headers?: Record<string, string> }
): Promise<AnnouncementDetail> {
  if (!UUID_REGEX.test(id)) {
    throw new Error("NOT_FOUND");
  }

  try {
    const { data } = await apiClient.get<
      ApiResponse<BackendAnnouncementDetail>
    >(`/announcements/${id}`, {
      ...options,
    });

    if (data.code !== 1000) {
      throw new Error(data.message || "Failed to fetch detail");
    }

    const item = data.result;
    return {
      id: item.id,
      title: item.title,
      content: item.content,
      category: ANNOUNCEMENT_TYPE_LABEL[item.announcementType] ?? "Thông báo",
      type: item.announcementType,

      author: item.createdByFullName || "Admin",

      avatarUrl: undefined,

      date: item.createdDate,

      views: 0,
      attachments: item.attachments || [],
    };
  } catch (error: any) {
    if (error.response?.status === 404) {
      throw new Error("NOT_FOUND");
    }
    throw error;
  }
});

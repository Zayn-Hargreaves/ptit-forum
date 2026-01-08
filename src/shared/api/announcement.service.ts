// shared/api/announcement.service.ts

import {
  AnnouncementResponse,
  AnnouncementSearchParams,
  BackendAnnouncementDetail,
  CreateAnnouncementPayload,
  ReleaseAnnouncementPayload,
  UpdateAnnouncementPayload,
} from '@/entities/announcement/model/types';

import { apiClient } from './axios-client';
import type { ApiResponse, PageResponse } from './types';

const BASE_URL = '/admin/announcements';

export const announcementApi = {
  // GET /api/admin/announcements/all
  search: async (params: AnnouncementSearchParams) => {
    const { page = 0, size = 10, ...filters } = params;
    const res = await apiClient.get<ApiResponse<PageResponse<AnnouncementResponse>>>(
      `${BASE_URL}/all`,
      { params: { page, size, ...filters } },
    );
    return {
      data: res.data.result.content,
      total: res.data.result.totalElements,
    };
  },

  // GET /api/admin/announcements/{id}
  getDetail: async (id: string) => {
    const res = await apiClient.get<ApiResponse<BackendAnnouncementDetail>>(`${BASE_URL}/${id}`);
    return res.data.result;
  },

  // POST /api/admin/announcements
  create: async (payload: CreateAnnouncementPayload) => {
    const res = await apiClient.post<ApiResponse<AnnouncementResponse>>(BASE_URL, payload);
    return res.data.result;
  },

  // PUT /api/admin/announcements/{id}
  update: async (id: string, payload: UpdateAnnouncementPayload) => {
    const res = await apiClient.put<ApiResponse<AnnouncementResponse>>(
      `${BASE_URL}/${id}`,
      payload,
    );
    return res.data.result;
  },

  // POST /api/admin/announcements/release-announcement/{id}
  release: async (id: string, payload: ReleaseAnnouncementPayload) => {
    const res = await apiClient.post<ApiResponse<string>>(
      `${BASE_URL}/release-announcement/${id}`,
      payload,
    );
    return res.data.result;
  },

  // DELETE /api/admin/announcements/{id}
  delete: async (id: string) => {
    const res = await apiClient.delete<ApiResponse<string>>(`${BASE_URL}/${id}`);
    return res.data.result;
  },
};

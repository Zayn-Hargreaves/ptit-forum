import { apiClient } from './axios-client';
import type { ApiResponse, PageResponse } from './types';

// Based on backend CommonSubjectController search method
// returns ApiResponse<Page<SubjectResponse>>
// But frontend might expect PaginatedResponse or PageResponse
// Let's look at Types again. PageResponse matches Spring Page.
// So result is PageResponse<SubjectResponse>

export const subjectService = {
  search: async (params?: { subjectName?: string; page?: number; limit?: number }) => {
    const { subjectName, page = 0, limit = 20 } = params || {};

    const response = await apiClient.get<ApiResponse<PageResponse<SubjectResponse>>>(
      '/subjects/search',
      {
        params: {
          subjectName,
          page, // Spring Page is 0-indexed
          size: limit,
        },
      },
    );

    return response.data;
  },
};

import {
  CreateSubjectPayload,
  SubjectResponse,
  SubjectSearchParams,
  UpdateSubjectPayload,
} from '@/entities/subject/model/types';
// Controller RequestMapping: "/api/admin/subjects"
// Giả định apiClient đã có baseURL là "/api", nên ta chỉ cần "/admin/subjects"
const BASE_URL = '/admin/subjects';

export const subjectApi = {
  // POST /api/admin/subjects
  create: async (payload: CreateSubjectPayload) => {
    const res = await apiClient.post<ApiResponse<SubjectResponse>>(BASE_URL, payload);
    return res.data.result;
  },

  // GET /api/admin/subjects/{subjectId}
  getDetail: async (subjectId: string) => {
    const res = await apiClient.get<ApiResponse<SubjectResponse>>(`${BASE_URL}/${subjectId}`);
    return res.data.result;
  },

  // GET /api/admin/subjects/search
  // Params: facultyId, semesterId, cohortCode, subjectName, page, size
  search: async (params: SubjectSearchParams) => {
    const { page = 0, size = 10, ...filters } = params;
    const res = await apiClient.get<ApiResponse<PageResponse<SubjectResponse>>>(
      `${BASE_URL}/search`,
      {
        params: {
          page,
          size,
          ...filters,
        },
      },
    );
    return {
      data: res.data.result.content,
      total: res.data.result.totalElements,
    };
  },

  // PUT /api/admin/subjects/{subjectId}
  update: async (subjectId: string, payload: UpdateSubjectPayload) => {
    const res = await apiClient.put<ApiResponse<SubjectResponse>>(
      `${BASE_URL}/${subjectId}`,
      payload,
    );
    return res.data.result;
  },

  // DELETE /api/admin/subjects/{subjectId}
  delete: async (subjectId: string) => {
    const res = await apiClient.delete<ApiResponse<string>>(`${BASE_URL}/${subjectId}`);
    return res.data.result;
  },
};

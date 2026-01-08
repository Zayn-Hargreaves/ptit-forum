import {
  CreateSubjectReferencePayload,
  SubjectReferenceResponse,
  SubjectReferenceSearchParams,
} from '@/entities/subject-reference/model/types';

import { apiClient } from './axios-client';
import type { ApiResponse, PageResponse } from './types';

const BASE_URL = '/admin/subject-references';

export const subjectReferenceApi = {
  // POST /api/admin/subject-references
  create: async (payload: CreateSubjectReferencePayload) => {
    const res = await apiClient.post<ApiResponse<SubjectReferenceResponse>>(BASE_URL, payload);
    return res.data.result;
  },

  // GET /api/admin/subject-references/{subjectReferenceId}
  getDetail: async (id: string) => {
    const res = await apiClient.get<ApiResponse<SubjectReferenceResponse>>(`${BASE_URL}/${id}`);
    return res.data.result;
  },

  // GET /api/admin/subject-references
  search: async (params: SubjectReferenceSearchParams) => {
    const { page = 0, size = 10, ...filters } = params;
    const res = await apiClient.get<ApiResponse<PageResponse<SubjectReferenceResponse>>>(BASE_URL, {
      params: { page, size, ...filters },
    });
    return {
      data: res.data.result.content,
      total: res.data.result.totalElements,
    };
  },

  // DELETE /api/admin/subject-references/{subjectReferenceId}
  delete: async (id: string) => {
    const res = await apiClient.delete<ApiResponse<string>>(`${BASE_URL}/${id}`);
    return res.data.result;
  },
};

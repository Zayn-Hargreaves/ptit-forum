// shared/api/semester.service.ts

import { CreateSemesterPayload, SemesterResponse } from '@/entities/semesters/model/types';

import { apiClient } from './axios-client';
import type { ApiResponse } from './types';

const BASE_URL = '/admin/semesters';

export const semesterApi = {
  // GET /api/admin/semesters/all
  getAll: async () => {
    const res = await apiClient.get<ApiResponse<SemesterResponse[]>>(`${BASE_URL}/all`);
    return res.data.result;
  },

  // GET /api/admin/semesters/{semesterId}
  getOne: async (id: number | string) => {
    const res = await apiClient.get<ApiResponse<SemesterResponse>>(`${BASE_URL}/${id}`);
    return res.data.result;
  },

  // POST /api/admin/semesters
  create: async (payload: CreateSemesterPayload) => {
    const res = await apiClient.post<ApiResponse<SemesterResponse>>(BASE_URL, payload);
    return res.data.result;
  },

  // Chưa có Update/Delete trong Controller nên chưa define ở đây
};

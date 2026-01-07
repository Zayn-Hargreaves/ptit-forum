import { apiClient } from './axios-client';
import type { ApiResponse, PageResponse } from './types';

export interface Faculty {
  id: string;
  facultyName: string;
  facultyCode: string;
  description?: string;
}

export interface FacultyPayload {
  facultyName: string;
  facultyCode: string;
  description?: string;
}

export const getAllFaculties = async (params: {
  page?: number;
  size?: number;
  search?: string;
}) => {
  const { page = 0, size = 10, search } = params;

  const res = await apiClient.get<ApiResponse<PageResponse<Faculty>>>('/admin/faculties', {
    params: { page, size, search },
  });

  return {
    data: res.data.result.content,
    total: res.data.result.totalElements,
  };
};

export const createFaculty = async (payload: FacultyPayload) => {
  const res = await apiClient.post<ApiResponse<Faculty>>('/admin/faculties', payload);
  return res.data.result;
};

export const updateFaculty = async (id: string, payload: FacultyPayload) => {
  const res = await apiClient.put<ApiResponse<Faculty>>(`/admin/faculties/${id}`, payload);
  return res.data.result;
};

export const deleteFaculty = async (id: string) => {
  await apiClient.delete(`/admin/faculties/${id}`);
};

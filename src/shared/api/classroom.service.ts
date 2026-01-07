import { apiClient } from './axios-client';
import type { ApiResponse, PageResponse } from './types';

// Enum giả lập cho CohortCode, bạn nên update theo backend
export enum CohortCode {
  D18 = 'D18',
  D19 = 'D19',
  D20 = 'D20',
  D21 = 'D21',
  D22 = 'D22',
  D23 = 'D23',
  D24 = 'D24',
  D25 = 'D25',
}

export interface Classroom {
  id: string;
  className: string;
  classCode: string;
  facultyName: string; // Response trả về tên khoa
  startedYear: number;
  endedYear: number;
  schoolYearCode: CohortCode;
}

export interface CreateClassroomPayload {
  className: string;
  classCode: string;
  startedYear: number;
  endedYear: number;
  schoolYearCode: CohortCode;
}

export interface UpdateClassroomPayload {
  className: string;
  startedYear: number;
  endedYear: number;
  schoolYearCode: CohortCode;
}

export interface ClassroomSearchParams {
  page?: number;
  size?: number;
  classCode?: string;
  facultyId?: string;
  schoolYearCode?: CohortCode;
}

// GET /api/admin/classrooms
export const searchAllClassrooms = async (params: ClassroomSearchParams) => {
  const { page = 0, size = 10, ...filters } = params;
  const res = await apiClient.get<ApiResponse<PageResponse<Classroom>>>('/admin/classrooms', {
    params: { page, size, ...filters },
  });
  return {
    data: res.data.result.content,
    total: res.data.result.totalElements,
  };
};

// POST /api/admin/classrooms/{facultyId}
export const createClassroom = async (facultyId: string, payload: CreateClassroomPayload) => {
  const res = await apiClient.post<ApiResponse<Classroom>>(
    `/admin/classrooms/${facultyId}`,
    payload,
  );
  return res.data.result;
};

// PUT /api/admin/classrooms/{classroomId}
export const updateClassroom = async (id: string, payload: UpdateClassroomPayload) => {
  const res = await apiClient.put<ApiResponse<Classroom>>(`/admin/classrooms/${id}`, payload);
  return res.data.result;
};

// DELETE /api/admin/classrooms/{classroomId}
export const deleteClassroom = async (id: string) => {
  await apiClient.delete(`/admin/classrooms/${id}`);
};

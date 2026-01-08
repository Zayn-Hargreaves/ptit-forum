import { apiClient } from '@/shared/api/axios-client';
import { ApiResponse, PageResponse } from '@/shared/api/types';

export interface Subject {
  id: string;
  subjectName: string;
  subjectCode: string;
}

export const subjectApi = {
  getAll: async () => {
    // Backend only has /search endpoint, not /api/subjects list
    const response = await apiClient.get<ApiResponse<PageResponse<Subject>>>('/subjects/search', {
      params: {
        page: 0,
        size: 1000, // Get enough subjects for filter
      },
    });
    return response.data.result.content;
  },
};

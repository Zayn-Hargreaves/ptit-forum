import { apiClient } from './axios-client';
import type { ApiResponse, PageResponse } from './types';

// Based on backend CommonSubjectController search method
// returns ApiResponse<Page<SubjectResponse>>
// But frontend might expect PaginatedResponse or PageResponse
// Let's look at Types again. PageResponse matches Spring Page.
// So result is PageResponse<SubjectResponse>

export interface SubjectResponse {
  id: string;
  subjectName: string;
  subjectCode: string;
  credit?: number;
  description?: string;
}

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

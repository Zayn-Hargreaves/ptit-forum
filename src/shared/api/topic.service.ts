// shared/api/topic.service.ts

import {
  DetailedTopicResponse,
  TopicResponse,
  TopicSearchParams,
} from '@/entities/topic/model/types';

import { apiClient } from './axios-client';
import type { ApiResponse, PageResponse } from './types';

const BASE_URL = '/topics';

export const topicApi = {
  // GET /api/admin/topics
  search: async (params: TopicSearchParams) => {
    const { page = 0, size = 10, ...filters } = params;

    const res = await apiClient.get<ApiResponse<PageResponse<TopicResponse>>>(BASE_URL, {
      params: { page, size, ...filters },
    });

    return {
      data: res.data.result.content,
      total: res.data.result.totalElements,
    };
  },

  // GET /api/admin/topics/{topicId}
  getDetail: async (id: string) => {
    const res = await apiClient.get<ApiResponse<DetailedTopicResponse>>(`${BASE_URL}/${id}`);
    return res.data.result;
  },

  // DELETE /api/admin/topics/soft-delete/{topicId}
  softDelete: async (id: string) => {
    const res = await apiClient.delete<ApiResponse<TopicResponse>>(`${BASE_URL}/soft-delete/${id}`);
    return res.data.result;
  },
};

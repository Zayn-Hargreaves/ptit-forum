// src/entities/topic/api/topic-api.ts
import { apiClient } from '@shared/api/axios-client';
import { ApiResponse, PageResponse } from '@shared/api/types';
import { Topic } from '../model/types';

export const topicApi = {
  getAll: async (cookie?: string) => {
    const { data } = await apiClient.get<ApiResponse<PageResponse<Topic>>>('/topics', {
      params: {
        page: 0,
        size: 100,
      },
      headers: cookie ? { Cookie: cookie } : {}, // Gửi kèm cookie để pass qua Auth
    });
    return data.result;
  },

  getPostableTopic: async () => {
    const { data } = await apiClient.get<ApiResponse<PageResponse<Topic>>>('/topics/postable', {
      params: {
        page: 0,
        size: 100,
      },
    });
    return data.result.content;
  },

  getByCategory: async (categoryId: string, page: number = 0, size: number = 100) => {
    const { data } = await apiClient.get<ApiResponse<PageResponse<Topic>>>(`/topics/category/${categoryId}`, {
      params: {
        page,
        size,
      },
    });
    return data.result.content;
  },
};

import { IPost, PostStatDTO } from '@/entities/post/model/types';

import { apiClient } from './axios-client';
import { ApiResponse } from './types';

const BASE_URL = '/posts';

export const postApi = {
  // GET /api/posts/dashboard/top-reacted
  getTopReacted: async () => {
    const res = await apiClient.get<ApiResponse<IPost[]>>(`${BASE_URL}/dashboard/top-reacted`);
    return res.data.result;
  },

  // GET /api/posts/dashboard/stats/daily
  getDailyStats: async () => {
    const res = await apiClient.get<ApiResponse<PostStatDTO[]>>(
      `${BASE_URL}/dashboard/stats/daily`,
    );
    return res.data.result;
  },

  // GET /api/posts/dashboard/stats/monthly
  getMonthlyStats: async () => {
    const res = await apiClient.get<ApiResponse<PostStatDTO[]>>(
      `${BASE_URL}/dashboard/stats/monthly`,
    );
    return res.data.result;
  },
};

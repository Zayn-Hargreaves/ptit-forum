import { apiClient } from '@shared/api/axios-client';
import { ApiResponse } from '@shared/api/types';

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  postCount?: number;
}

export const categoryApi = {
  getAll: async (accessToken?: string) => {
    const config = accessToken ? { headers: { Authorization: `Bearer ${accessToken}` } } : {};
    const { data } = await apiClient.get<ApiResponse<Category[]>>('/categories', config);
    return data.result;
  },

  getOne: async (id: string, accessToken?: string) => {
    const config = accessToken ? { headers: { Authorization: `Bearer ${accessToken}` } } : {};
    const { data } = await apiClient.get<ApiResponse<Category>>(`/categories/${id}`, config);
    return data.result;
  },
};


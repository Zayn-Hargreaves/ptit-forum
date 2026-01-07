import { apiClient } from '@shared/api/axios-client';
import { ApiResponse } from '@shared/api/types';
import { ICategory } from '../model/types';

export const categoryApi = {
  getAll: async (accessToken?: string): Promise<ICategory[]> => {
    const config = accessToken ? { headers: { Authorization: `Bearer ${accessToken}` } } : {};
    const { data } = await apiClient.get<ApiResponse<ICategory[]>>('/categories', config);
    return data.result;
  },

  getOne: async (id: string, accessToken?: string): Promise<ICategory> => {
    const config = accessToken ? { headers: { Authorization: `Bearer ${accessToken}` } } : {};
    const { data } = await apiClient.get<ApiResponse<ICategory>>(`/categories/${id}`, config);
    return data.result;
  },
};



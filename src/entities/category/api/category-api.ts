import { apiClient } from "@shared/api/axios-client";
import { ApiResponse } from "@shared/api/types";

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  postCount?: number;
}

export const categoryApi = {
  getAll: async () => {
    const { data } = await apiClient.get<ApiResponse<Category[]>>(
      "/categories"
    );
    return data.result;
  },
};

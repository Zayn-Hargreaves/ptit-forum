// shared/api/category.service.ts

import { apiClient } from './axios-client';
import type { ApiResponse } from './types';
import {
    CategoryResponse,
    CreateCategoryPayload,
    UpdateCategoryPayload
} from '@/entities/category/model/types'; // Nhớ sửa đường dẫn import đúng với project của bạn

// Backend mapping: @RequestMapping("/api/categories")
// Giả định axios-client đã cấu hình baseURl là '/api'
const BASE_URL = '/categories';

export const categoryApi = {
    // GET /api/categories
    // Lưu ý: BE trả về List<CategoryResponse>, không phải Page
    getAll: async () => {
        const res = await apiClient.get<ApiResponse<CategoryResponse[]>>(
            BASE_URL
        );
        return res.data.result;
    },

    // GET /api/categories/{categoryId}
    getOne: async (id: string) => {
        const res = await apiClient.get<ApiResponse<CategoryResponse>>(
            `${BASE_URL}/${id}`
        );
        return res.data.result;
    },

    // POST /api/categories
    create: async (payload: CreateCategoryPayload) => {
        const res = await apiClient.post<ApiResponse<CategoryResponse>>(
            BASE_URL,
            payload
        );
        return res.data.result;
    },

    // PUT /api/categories/{categoryId}
    update: async (id: string, payload: UpdateCategoryPayload) => {
        const res = await apiClient.put<ApiResponse<CategoryResponse>>(
            `${BASE_URL}/${id}`,
            payload
        );
        return res.data.result;
    },

    // DELETE /api/categories/{categoryId}
    delete: async (id: string) => {
        const res = await apiClient.delete<ApiResponse<string>>(
            `${BASE_URL}/${id}`
        );
        return res.data.result;
    }
};
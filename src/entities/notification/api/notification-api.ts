import { apiClient } from '@/shared/api';

import { NotificationResponse } from '../model/types';

// Backend wraps response in ApiResponse { code, result }
interface ApiResponse<T> {
  code: number;
  result: T;
  message?: string;
}

export const notificationApi = {
  getNotifications: async (page: number, limit = 10) => {
    const response = await apiClient.get<ApiResponse<NotificationResponse>>('/notifications', {
      params: { page, limit, sort: 'deliveredAt,desc' },
    });
    // Fix: Backend uses custom code 1000 for success
    if (!response.data || response.data.code !== 1000) {
      throw new Error(response.data?.message || 'Failed to fetch notifications');
    }
    return response.data.result;
  },

  getUnreadCount: async () => {
    const response = await apiClient.get<ApiResponse<number>>('/notifications/unread-count');
    if (!response.data || response.data.code !== 1000) {
      throw new Error(response.data?.message || 'Failed to fetch unread count');
    }
    return response.data.result;
  },

  markAsRead: async (id: string) => {
    await apiClient.put(`/notifications/${id}/read`);
  },

  markAllAsRead: async () => {
    await apiClient.put('/notifications/read-all');
  },
};

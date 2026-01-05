// src/entities/session/api/session-api.ts
import { apiClient } from '@shared/api/axios-client';
import { UpdateProfilePayload, UserProfile, UserProfileResponseDto } from '../model/types';
import { ApiResponse } from '@shared/api/types';

const mapToUser = (data: any): UserProfile => {
  return {
    ...data,
    avatarUrl: data.avatarUrl || data.avatar,
    studentCode: data.studentCode || data.studentId,
    classCode: data.classCode || data.className,
    facultyName: data.facultyName || data.faculty,
    role: data.permissions?.includes('ROLE_ADMIN') ? 'ADMIN' : 'USER',
  };
};

export const sessionApi = {
  me: async () => {
    const { data } = await apiClient.get<{ user: UserProfile }>('/auth/me'); // Call local Next.js API
    return data.user;
  },

  getProfile: async () => {
    const { data } = await apiClient.get<ApiResponse<any>>('/users/profile');
    return mapToUser(data.result);
  },

  updateProfile: async (payload: UpdateProfilePayload) => {
    const { data } = await apiClient.patch<ApiResponse<any>>('/users/profile', payload);
    return mapToUser(data.result);
  },

  uploadAvatar: async (file: File): Promise<UserProfile> => {
    const formData = new FormData();
    formData.append('image', file);

    const { data } = await apiClient.put<ApiResponse<UserProfileResponseDto>>('/users/profile', formData, {
      headers: {
        'Content-Type': null,
      },
    });

    return mapToUser(data.result);
  },

  logout: async () => {
    await apiClient.post('/auth/logout');
  },
};

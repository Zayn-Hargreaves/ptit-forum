// src/entities/session/api/session-api.ts
import { apiClient } from '@shared/api/axios-client';
import { ApiResponse } from '@shared/api/types';

import { UpdateProfilePayload, UserProfile } from '../model/types';

const mapToUser = (data: unknown): UserProfile => {
  const d = data as Record<string, unknown>;
  return {
    id: d.id as string,
    email: d.email as string,
    fullName: d.fullName as string,
    avatarUrl: (d.avatarUrl || d.avatar) as string,
    studentCode: (d.studentCode || d.studentId) as string,
    classCode: (d.classCode || d.className) as string,
    facultyName: (d.facultyName || d.faculty) as string,
    role: (d.permissions as string[])?.includes('ROLE_ADMIN') ? 'ADMIN' : 'USER',
  };
};

export const sessionApi = {
  me: async () => {
    const { data } = await apiClient.get<{ user: UserProfile }>('/auth/me'); // Call local Next.js API
    return data.user;
  },

  getProfile: async () => {
    const { data } = await apiClient.get<ApiResponse<unknown>>('/users/profile');
    return mapToUser(data.result);
  },

  updateProfile: async (payload: UpdateProfilePayload, avatar?: File) => {
    const formData = new FormData();

    if (payload.fullName) formData.append('fullName', payload.fullName);
    if (payload.phone) formData.append('phone', payload.phone);
    if (payload.studentCode) formData.append('studentCode', payload.studentCode);
    if (payload.classCode) formData.append('classCode', payload.classCode);

    if (avatar) {
      formData.append('image', avatar);
    }

    const { data } = await apiClient.put<ApiResponse<unknown>>('/users/profile', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return mapToUser(data.result);
  },

  logout: async () => {
    await apiClient.post('/auth/logout');
  },
};

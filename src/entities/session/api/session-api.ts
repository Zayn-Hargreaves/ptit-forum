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

  updateProfile: async (payload: UpdateProfilePayload, avatar?: File) => {
    const formData = new FormData();
    
    // CRITICAL: Create Blob with application/json type for Spring Boot @RequestPart
    const jsonPart = new Blob([JSON.stringify(payload)], { 
      type: "application/json" 
    });
    formData.append("data", jsonPart);
    
    if (avatar) {
      formData.append("avatar", avatar);
    }
    
    // CRITICAL: Remove Content-Type header to let axios auto-set multipart/form-data with boundary
    const { data } = await apiClient.put<ApiResponse<any>>('/users/profile', formData, {
      headers: {
        'Content-Type': undefined, // Let axios handle it
      },
    });
    return mapToUser(data.result);
  },

  logout: async () => {
    await apiClient.post('/auth/logout');
  },
};

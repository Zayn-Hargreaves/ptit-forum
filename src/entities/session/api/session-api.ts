// src/entities/session/api/session-api.ts
import { apiClient } from "@shared/api/axios-client";
import {
  UpdateProfilePayload,
  User,
  UserProfileResponseDto,
} from "../model/types";
import { ApiResponse } from "@shared/api/types";

const mapToUser = (data: any): User => {
  return {
    ...data,
    avatarUrl: data.avatarUrl || data.avatar,
    studentCode: data.studentCode || data.studentId,
    classCode: data.classCode || data.className,
    facultyName: data.facultyName || data.faculty,
  };
};

export const sessionApi = {
  me: async () => {
    const { data } = await apiClient.get<ApiResponse<any>>("/users/me");
    return mapToUser(data.result);
  },

  getProfile: async () => {
    const { data } = await apiClient.get<ApiResponse<any>>("/users/profile");
    return mapToUser(data.result);
  },

  updateProfile: async (payload: UpdateProfilePayload) => {
    const { data } = await apiClient.patch<ApiResponse<any>>(
      "/users/profile",
      payload
    );
    return mapToUser(data.result);
  },

  uploadAvatar: async (file: File): Promise<User> => {
    const formData = new FormData();
    formData.append("image", file);

    const { data } = await apiClient.put<ApiResponse<UserProfileResponseDto>>(
      "/users/profile/avatar",
      formData,
      {
        headers: {
          "Content-Type": null,
        },
      }
    );

    return mapToUser(data.result);
  },

  logout: async () => {
    await apiClient.post("/auth/logout");
  },
};

import { apiClient } from "./axios-client";
import { UserProfile } from "@/entities/session/model/types";
import { ApiResponse } from "./types";

export interface UpdateProfilePayload {
    fullName?: string;
    phone?: string;
    studentCode?: string;
    classCode?: string;
    image?: File;
}

export const updateProfile = async (data: UpdateProfilePayload): Promise<UserProfile> => {
    const formData = new FormData();
    if (data.fullName) formData.append('fullName', data.fullName);
    if (data.phone) formData.append('phone', data.phone);
    if (data.studentCode) formData.append('studentCode', data.studentCode);
    if (data.classCode) formData.append('classCode', data.classCode);
    if (data.image) formData.append('image', data.image);

    const response = await apiClient.put<ApiResponse<UserProfile>>('/users/profile', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data.result;
};

export const getMyProfile = async (): Promise<UserProfile> => {
    const response = await apiClient.get<ApiResponse<UserProfile>>('/users/profile');
    return response.data.result;
};

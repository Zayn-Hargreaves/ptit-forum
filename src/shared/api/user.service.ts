import { apiClient } from "./axios-client";
import { User } from "@/entities/user/schema";
import { ApiResponse } from "./types";

export interface UpdateProfilePayload {
    name?: string;
    // Add other fields if backend supports (e.g. bio, phone)
}

export const updateProfile = async (data: UpdateProfilePayload): Promise<User> => {
    const response = await apiClient.put<ApiResponse<User>>('/users/me', data);
    return response.data.result;
};

// Add other user related methods here if needed

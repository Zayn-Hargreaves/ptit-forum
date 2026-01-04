import { apiClient } from '@shared/api/axios-client';
import {
  UserProfile,
  UserProfileResponseDto,
  mapUserProfileResponseDtoToUserProfile,
} from '@entities/session/model/types';
import { ApiResponse } from '@entities/announcement/model/types'; // Temporary import location

export const getUserProfile = async (userId: string): Promise<UserProfile> => {
  const response = await apiClient.get<ApiResponse<UserProfileResponseDto>>(`/users/${userId}/profile`);
  return mapUserProfileResponseDtoToUserProfile(response.data.result);
};

export const getMyProfile = async (): Promise<UserProfile> => {
  const response = await apiClient.get<ApiResponse<UserProfileResponseDto>>('/users/profile');
  return mapUserProfileResponseDtoToUserProfile(response.data.result);
};

export const followUser = async (userId: string): Promise<string> => {
  const response = await apiClient.post<ApiResponse<string>>(`/users/${userId}/follow`);
  return response.data.result;
};

export const unfollowUser = async (userId: string): Promise<string> => {
  const response = await apiClient.delete<ApiResponse<string>>(`/users/${userId}/follow`);
  return response.data.result;
};

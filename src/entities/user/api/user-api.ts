import { ApiResponse } from '@entities/announcement/model/types'; // Temporary import location
import {
  mapUserProfileResponseDtoToUserProfile,
  UserProfile,
  UserProfileResponseDto,
} from '@entities/session/model/types';
import { apiClient } from '@shared/api/axios-client';

export const getUserProfile = async (userId: string): Promise<UserProfile> => {
  const response = await apiClient.get<ApiResponse<UserProfileResponseDto>>(`/users/${userId}`);
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

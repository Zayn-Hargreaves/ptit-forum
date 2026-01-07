import { apiClient } from '@/shared/api/axios-client';
import { ApiResponse, PageResponse } from '@/shared/api/types';

import { SearchUserParams, User } from '../model/types';

export const getUsers = async (params: SearchUserParams) => {
  const { page, size, sort, ...filters } = params;
  
  const queryParams = new URLSearchParams();
  if (page !== undefined) queryParams.append('page', page.toString());
  if (size !== undefined) queryParams.append('size', size.toString());
  if (sort) sort.forEach((s) => queryParams.append('sort', s));
  
  // Filters
  if (filters.email) queryParams.append('email', filters.email);
  if (filters.fullName) queryParams.append('fullName', filters.fullName);
  if (filters.studentCode) queryParams.append('studentCode', filters.studentCode);
  if (filters.classCode) queryParams.append('classCode', filters.classCode);
  if (filters.enable !== undefined) queryParams.append('enable', filters.enable.toString());

  const url = `/users?${queryParams.toString()}`;
  console.log('Fetching Users URL:', url);
  const response = await apiClient.get<ApiResponse<PageResponse<User>>>(url);
  const { content, totalElements, totalPages, number, size: pageSize } = response.data.result;

  return {
    data: content,
    meta: {
      page: number + 1,
      limit: pageSize,
      total: totalElements,
      totalPages: totalPages,
    },
  };
};

export const deleteUser = async (userId: string) => {
  const response = await apiClient.delete<ApiResponse<string>>(`/users/${userId}`);
  return response.data;
};

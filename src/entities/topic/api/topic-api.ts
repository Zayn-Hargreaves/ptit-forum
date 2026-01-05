// src/entities/topic/api/topic-api.ts
import { apiClient } from '@shared/api/axios-client';
import { ApiResponse, PageResponse } from '@shared/api/types';
import { Topic, TopicDetail, TopicMember, CreateTopicRequest } from '../model/types';

export const topicApi = {
  getAll: async (accessToken?: string) => {
    let headers = {};
    if (accessToken) {
      headers = { Authorization: `Bearer ${accessToken}` };
    }

    const { data } = await apiClient.get<ApiResponse<PageResponse<Topic>>>('/topics', {
      params: {
        page: 0,
        size: 100,
      },
      headers: { ...headers },
    });
    return data.result;
  },

  getPostableTopic: async () => {
    const { data } = await apiClient.get<ApiResponse<PageResponse<Topic>>>('/topics', {
      params: {
        page: 0,
        size: 100,
      },
    });
    return data.result.content;
  },

  getByCategory: async (categoryId: string, accessToken?: string, page: number = 0, size: number = 100) => {
    const config = accessToken ? { headers: { Authorization: `Bearer ${accessToken}` } } : {};
    const { data } = await apiClient.get<ApiResponse<PageResponse<Topic>>>(`/topics/category/${categoryId}`, {
      ...config,
      params: {
        page,
        size,
      },
    });
    return data.result.content;
  },

  getById: async (id: string, accessToken?: string) => {
    const config = accessToken ? { headers: { Authorization: `Bearer ${accessToken}` } } : {};
    const { data } = await apiClient.get<ApiResponse<TopicDetail>>(`/topics/${id}`, config);
    return data.result;
  },


  getMembers: async (topicId: string, params?: { approved?: boolean; page?: number; size?: number }) => {
    const { approved, page = 0, size = 10 } = params || {};
    const { data } = await apiClient.get<ApiResponse<PageResponse<TopicMember>>>(`/topic-members/topic/${topicId}`, {
      params: {
        approved,
        page,
        size,
      },
    });
    return data.result;
  },

  approveMember: async (memberId: string) => {
    const { data } = await apiClient.post<ApiResponse<any>>(`/topic-members/approve/${memberId}`);
    return data.result;
  },

  rejectMember: async (topicId: string, userId: string) => {
    const { data } = await apiClient.delete<ApiResponse<any>>(`/topic-members/${topicId}/kick/${userId}`);
    return data.result;
  },

  join: async (topicId: string) => {
    const { data } = await apiClient.post<ApiResponse<any>>(`/topic-members/join/${topicId}`);
    return data.result;
  },

  create: async (categoryId: string, request: CreateTopicRequest) => {
    const { data } = await apiClient.post<ApiResponse<Topic>>(`/topics/category/${categoryId}`, request);
    return data.result;
  },
};


import { apiClient } from '@shared/api/axios-client';
import { ApiResponse } from '@shared/api/types';

import { ITopic } from '../model/types';

export const topicApi = {
  getTopics: async (params?: { search?: string }): Promise<ITopic[]> => {
    const { data } = await apiClient.get<
      ApiResponse<{
        content: Array<{
          id: string;
          title: string;
          content: string;
          topicVisibility: 'PUBLIC' | 'PRIVATE';
          approvedPostCount: number;
          memberCount: number;
        }>;
      }>
    >('/topics', {
      params: {
        keyword: params?.search,
      },
    });

    return data.result.content.map((topic) => ({
      id: topic.id,
      name: topic.title,
      description: topic.content,
      avatar: '',
      isPublic: topic.topicVisibility === 'PUBLIC',
      memberCount: topic.memberCount,
      postCount: topic.approvedPostCount,
    }));
  },

  // Placeholder for detail
  getTopicDetail: async (id: string, accessToken?: string): Promise<ITopic> => {
    const config = accessToken ? { headers: { Authorization: `Bearer ${accessToken}` } } : {};

    try {
      // Case 1: Try direct GET by ID (Optimal)
      const { data } = await apiClient.get<
        ApiResponse<{
          id: string;
          title: string;
          content: string;
          topicVisibility: 'PUBLIC' | 'PRIVATE';
          approvedPostCount: number;
          memberCount: number;
          currentUserContext?: {
            topicMember: boolean;
            topicManager: boolean;
            topicCreator: boolean;
            requestStatus: 'NONE' | 'PENDING' | 'APPROVED';
          };
        }>
      >(`/topics/${id}`, config);

      const res = data.result;
      return {
        id: res.id,
        name: res.title,
        description: res.content,
        avatar: '',
        isPublic: res.topicVisibility === 'PUBLIC',
        topicVisibility: res.topicVisibility,
        currentUserContext: res.currentUserContext,
        memberCount: res.memberCount,
        postCount: res.approvedPostCount,
      };
    } catch (error: unknown) {
      const err = error as { response?: { status?: number } };
      // Case 2: Fallback to searching if Detail API is not implemented or 404 handled differently
      // Only fallback if error is 404 or backend specific issue
      console.warn('API getDetail failed, trying fallback search...', err.response?.status);

      const { data } = await apiClient.get<ApiResponse<ITopic[]>>('/topics', {
        ...config,
        params: { keyword: id },
      });

      const topic = data.result.find((t) => t.id === id);
      if (!topic) throw new Error('Topic not found');
      return topic;
    }
  },

  getOne: async (id: string): Promise<ITopic> => {
    return topicApi.getTopicDetail(id);
  },

  getByCategory: async (categoryId: string, accessToken?: string): Promise<ITopic[]> => {
    const config = accessToken ? { headers: { Authorization: `Bearer ${accessToken}` } } : {};
    const { data } = await apiClient.get<
      ApiResponse<{
        content: Array<{
          id: string;
          title: string;
          content: string;
          topicVisibility: 'PUBLIC' | 'PRIVATE';
          approvedPostCount: number;
          memberCount: number;
        }>;
      }>
    >(`/topics/category/${categoryId}`, config);

    return data.result.content.map((topic) => ({
      id: topic.id,
      name: topic.title,
      description: topic.content,
      avatar: '',
      isPublic: topic.topicVisibility === 'PUBLIC',
      memberCount: topic.memberCount,
      postCount: topic.approvedPostCount,
    }));
  },

  create: async (
    categoryId: string,
    data: { name: string; description: string; isPublic: boolean },
  ): Promise<ITopic> => {
    const payload = {
      title: data.name,
      content: data.description,
      topicVisibility: data.isPublic ? 'PUBLIC' : 'PRIVATE',
    };

    const { data: res } = await apiClient.post<
      ApiResponse<{
        id: string;
        title: string;
        content: string;
        topicVisibility: 'PUBLIC' | 'PRIVATE';
      }>
    >(`/topics/category/${categoryId}`, payload);

    const topic = res.result;

    return {
      id: topic.id,
      name: topic.title,
      description: topic.content,
      avatar: '',
      isPublic: topic.topicVisibility === 'PUBLIC',
      memberCount: 0,
      postCount: 0,
    };
  },

  updateTopic: async (
    id: string,
    data: { name: string; description: string; isPublic: boolean },
  ): Promise<ITopic> => {
    const payload = {
      title: data.name,
      content: data.description,
      topicVisibility: data.isPublic ? 'PUBLIC' : 'PRIVATE',
    };

    const { data: res } = await apiClient.put<
      ApiResponse<{
        id: string;
        title: string;
        content: string;
        topicVisibility: 'PUBLIC' | 'PRIVATE';
      }>
    >(`/topics/${id}`, payload);

    const topic = res.result;

    return {
      id: topic.id,
      name: topic.title,
      description: topic.content,
      avatar: '',
      isPublic: topic.topicVisibility === 'PUBLIC',
      topicVisibility: topic.topicVisibility,
      memberCount: 0,
      postCount: 0,
    };
  },
};

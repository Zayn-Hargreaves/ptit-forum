// src/entities/post/api/post-api.ts
import { apiClient } from '@shared/api/axios-client';
import { ApiResponse, PageResponse } from '@shared/api/types';
import { Post, CreatePostPayload } from '../model/types'; // giữ CreatePostPayload

// Params mapping theo Backend Spec (mode + range)
// Params mapping theo Backend Spec (mode + range)
export interface GetPostsParams {
  pageParam?: number;
  size?: number;
  topicId?: string | null;
  authorId?: string | null;

  // New
  mode?: 'latest' | 'trending';
  range?: 'DAY' | 'WEEK' | 'MONTH' | 'ALL'; // Enum uppercase chuẩn BE
}

export const postApi = {
  // 1. Get Newsfeed (Latest / Trending)
  getNewsfeed: async (params: GetPostsParams) => {
    const { mode = 'latest', range = 'WEEK', topicId, authorId, pageParam = 0, size = 10 } = params;

    // Trending -> /posts/featured
    if (mode === 'trending') {
      const { data } = await apiClient.get<ApiResponse<PageResponse<Post>>>('/posts/featured', {
        params: {
          page: pageParam,
          size,
          range,
          topicId: topicId || undefined,
        },
      });
      return data.result;
    }

    const { data } = await apiClient.get<ApiResponse<PageResponse<Post>>>('/posts', {
      params: {
        page: pageParam,
        size,
        sort: 'createdDateTime,desc',
        topicId: topicId || undefined,
        authorId: authorId || undefined,
      },
    });
    return data.result;
  },

  getDetail: async (id: string) => {
    const { data } = await apiClient.get<ApiResponse<Post>>(`/posts/${id}`);
    return data.result;
  },

  create: async (payload: CreatePostPayload) => {
    const { topicId, ...body } = payload;
    const { data } = await apiClient.post<ApiResponse<Post>>(`/posts/topic/${topicId}`, body);
    return data.result;
  },

  getByTopic: async (topicId: string, params: GetPostsParams) => {
    const { pageParam = 0, size = 10 } = params;

    const { data } = await apiClient.get<ApiResponse<PageResponse<Post>>>(`/posts/topic/${topicId}`, {
      params: {
        page: pageParam,
        size,
        sort: 'createdDateTime,desc',
      },
    });

    return data.result;
  },

  increaseView: async (postId: string) => {
    const { data } = await apiClient.post<{ code: number; result: { viewCount: number } }>(`/posts/${postId}/view`);
    return data.result;
  },

  update: async (id: string, payload: CreatePostPayload) => {
    const { topicId, ...body } = payload;
    const { data } = await apiClient.put<ApiResponse<Post>>(`/posts/${id}`, body);
    return data.result;
  },

  delete: async (id: string) => {
    const { data } = await apiClient.patch<ApiResponse<any>>(`/posts/${id}/archive`);
    return data.result;
  },

  getMyPosts: async (page = 0, size = 10) => {
    // Assuming /users/me/posts exists or we filter by authorId='me' if backend handles it
    // Trying /users/me/posts first
    try {
      const { data } = await apiClient.get<ApiResponse<PageResponse<Post>>>('/users/me/posts', {
        params: { page, size, sort: 'createdDateTime,desc' }
      });
      return data.result;
    } catch (e) {
      // Fallback to getNewsfeed? But 'me' authorId might not work if backend expects UUID.
      // Let's assume the backend has this endpoint for "My Posts" or similar.
      throw e;
    }
  },

  getPendingByTopic: async (topicId: string, page = 0, size = 10) => {
    const { data } = await apiClient.get<ApiResponse<PageResponse<Post>>>(`/posts/topic/${topicId}/search`, {
      params: {
        postStatus: 'PENDING',
        page,
        size,
        sort: 'createdDateTime,desc',
      },
    });
    return data.result;
  },

  upgradeStatus: async (postId: string, status: 'APPROVED' | 'REJECTED' | 'PENDING') => {
    const { data } = await apiClient.put<ApiResponse<Post>>(`/posts/upgrade-post/${postId}`, null, {
      params: { postStatus: status }
    });
    return data.result;
  },
};

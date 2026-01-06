import { apiClient } from '@shared/api/axios-client';
import { ApiResponse, PageResponse } from '@shared/api/types';

import { Comment, CreateCommentPayload } from '../model/types';

export const commentApi = {
  getRootComments: async (postId: string, page = 0) => {
    const { data } = await apiClient.get<ApiResponse<PageResponse<Comment>>>(
      `/comments/post/${postId}`,
      {
        params: { page, size: 10, sort: 'createdDateTime,desc' },
      },
    );
    return data.result;
  },

  getReplies: async (rootCommentId: string, page = 0) => {
    const { data } = await apiClient.get<ApiResponse<PageResponse<Comment>>>(
      `/comments/replies/${rootCommentId}`,
      {
        params: { page, size: 5, sort: 'createdDateTime,asc' },
      },
    );
    return data.result;
  },

  create: async (payload: CreateCommentPayload) => {
    const { postId: _postId, ...body } = payload;
    const { data } = await apiClient.post<ApiResponse<Comment>>(
      `/comments/post/${payload.postId}`,
      body,
    );
    return data.result;
  },

  update: async (commentId: string, payload: { content: string }) => {
    const { data } = await apiClient.put<ApiResponse<Comment>>(`/comments/${commentId}`, payload);
    return data.result;
  },

  delete: async (commentId: string) => {
    await apiClient.delete(`/comments/${commentId}`);
  },
};

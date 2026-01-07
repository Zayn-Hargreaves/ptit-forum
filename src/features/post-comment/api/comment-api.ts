import { IComment } from '../model/types';
// import { apiClient } from '@shared/api/axios-client';

import { apiClient } from '@shared/api/axios-client';
import { ApiResponse } from '@shared/api/types';

export const commentApi = {
  getComments: async (postId: string, page = 0, size = 10): Promise<IComment[]> => {
      // Endpoint: GET /api/comments/post/{postId}
      const { data } = await apiClient.get<ApiResponse<{ content: any[] }>>(`/comments/post/${postId}`, {
          params: { page, size }
      });
      return data.result.content.map((c: any) => ({
          id: c.id,
          content: c.content,
          author: {
              id: c.authorId || (c.author ? c.author.id : 'unknown'),
              fullName: c.authorName || (c.author ? c.author.fullName : 'Người dùng ẩn danh'),
              avatar: c.authorAvatarUrl || (c.author ? c.author.avatarUrl : '')
          },
          createdAt: c.createdDateTime,
          replyCount: c.repliesCount || 0,
          postId: c.postId,
          isLiked: c.isLiked,
          reactionCount: c.reactionCount,
          parentId: c.parentId
      }));
  },

  createComment: async (postId: string, content: string, parentId?: string): Promise<IComment> => {
      let url = `/comments/post/${postId}`;
      if (parentId) {
          url = `/comments/${parentId}/replies`;
      }
      
      const { data } = await apiClient.post<ApiResponse<any>>(url, { content });
      const c = data.result;
      
      // Map response to IComment
      return {
          id: c.id,
          content: c.content,
          author: {
              id: c.authorId || (c.author ? c.author.id : 'unknown'),
              fullName: c.authorName || (c.author ? c.author.fullName : 'Người dùng ẩn danh'),
              avatar: c.authorAvatarUrl || (c.author ? c.author.avatarUrl : '')
          },
          createdAt: c.createdDateTime,
          replyCount: 0,
          postId: c.postId,
          isLiked: c.isLiked,
          reactionCount: c.reactionCount,
          parentId: c.parentId
      };
  }
};

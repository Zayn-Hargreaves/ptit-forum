import { apiClient } from '@shared/api/axios-client';
import { ApiResponse } from '@shared/api/types';

import { IComment } from '../model/types';

// Define strict DTO for comment response
interface CommentDto {
  id: string;
  content: string;
  authorId?: string;
  authorName?: string;
  authorAvatarUrl?: string;
  author?: {
    id: string;
    fullName: string;
    avatarUrl?: string;
    email?: string;
  };
  createdDateTime: string;
  repliesCount?: number;
  postId: string;
  isLiked?: boolean;
  reactionCount: number;
  parentId?: string;
  permissions?: {
    canEdit: boolean;
    canDelete: boolean;
    canReport: boolean;
  };
  commentCreator?: boolean;
}

const mapDtoToComment = (c: CommentDto): IComment => {
  const normalizeDate = (dateStr: string) => {
    if (!dateStr) return new Date().toISOString();
    return !dateStr.endsWith('Z') && !dateStr.includes('+') ? `${dateStr}Z` : dateStr;
  };

  return {
    id: c.id,
    content: c.content,
    author: {
      id: c.authorId || (c.author ? c.author.id : 'unknown'),
      fullName:
        c.authorName ||
        (c.author ? c.author.fullName || c.author.email : '') ||
        'Người dùng ẩn danh',
      avatar: c.authorAvatarUrl || (c.author ? c.author.avatarUrl : '') || '',
    },
    createdAt: normalizeDate(c.createdDateTime),
    replyCount: c.repliesCount || 0,
    postId: c.postId,
    isLiked: c.isLiked,
    reactionCount: c.reactionCount,
    parentId: c.parentId,
    permissions: c.permissions,
    commentCreator: c.commentCreator,
  };
};

export const commentApi = {
  getComments: async (postId: string, page = 0, size = 10): Promise<IComment[]> => {
    // Endpoint: GET /api/comments/post/{postId}
    const { data } = await apiClient.get<ApiResponse<{ content: CommentDto[] }>>(
      `/comments/post/${postId}`,
      {
        params: { page, size },
      },
    );
    return data.result.content.map(mapDtoToComment);
  },

  createComment: async (postId: string, content: string, parentId?: string): Promise<IComment> => {
    let url = `/comments/post/${postId}`;
    if (parentId) {
      url = `/comments/${parentId}/replies`;
    }

    const { data } = await apiClient.post<ApiResponse<CommentDto>>(url, { content });
    return mapDtoToComment(data.result);
  },
};

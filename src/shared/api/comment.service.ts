import { apiClient, getPublicImageUrl } from './axios-client';
import type { ApiResponse, PageResponse } from './types';

export interface CommentDto {
  id: string;
  content: string;
  author: {
    id: string;
    fullName: string;
    avatarUrl?: string;
  };
  postId: string;
  createdDateTime: string;
  reactionCount: number;
}

export const getUserComments = async (
  userId: string,
  params: { page?: number; limit?: number } = {},
): Promise<{ data: CommentDto[]; total: number }> => {
  const { page = 1, limit = 10 } = params;
  const pageIndex = page > 0 ? page - 1 : 0;

  const response = await apiClient.get<ApiResponse<PageResponse<CommentDto>>>(
    `/comments/user/${userId}`,
    {
      params: {
        page: pageIndex,
        size: limit,
      },
    },
  );

  const pageData = response.data.result;
  const comments = pageData.content.map((dto) => ({
    ...dto,
    author: {
      ...dto.author,
      avatarUrl: getPublicImageUrl(dto.author.avatarUrl),
    },
  }));

  return {
    data: comments,
    total: pageData.totalElements,
  };
};

export const commentService = {
  getUserComments,
};

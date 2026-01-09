import { apiClient } from '@shared/api/axios-client';
import { ApiResponse } from '@shared/api/types';

import { IPost } from '../model/types';

interface PostDto {
  id: string;
  title: string;
  content: string;
  author: {
    id: string;
    fullName: string;
    avatarUrl?: string;
    email?: string;
  };
  createdDateTime?: string;
  createdAt?: string;
  postStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
  attachments?: {
    id: string;
    contentType?: string;
    fileName: string;
    url: string;
    size?: number;
  }[];
  reactionCount?: number;
  isLiked?: boolean;
  totalPages?: number;
}

// Helper to map BE response to Frontend IPost
const mapToIPost = (data: PostDto): IPost => {
  // FIX: Handle date parsing robustly. BE sends LocalDateTime (no 'Z'), treat as UTC.
  const rawDate = data.createdDateTime || data.createdAt;
  let createdAt = new Date().toISOString();

  if (rawDate) {
    // If string doesn't specify timezone and looks like ISO (without Z), append Z
    if (typeof rawDate === 'string' && !rawDate.endsWith('Z') && !rawDate.includes('+')) {
      createdAt = `${rawDate}Z`;
    } else {
      createdAt = new Date(rawDate).toISOString();
    }
  }

  return {
    id: data.id,
    title: data.title,
    content: data.content,
    author: {
      id: data.author?.id || 'unknown',
      fullName: data.author?.fullName || data.author?.email || 'Người dùng ẩn danh',
      avatarUrl: data.author?.avatarUrl || '',
    },
    createdAt: createdAt,
    postStatus: data.postStatus, // PENDING, APPROVED, REJECTED
    images:
      data.attachments
        ?.filter(
          (f) =>
            f.contentType?.startsWith('image/') || f.fileName?.match(/\.(jpg|jpeg|png|gif|webp)$/i),
        )
        .map((file) => file.url) || [],
    documents:
      data.attachments
        ?.filter(
          (f) =>
            !f.contentType?.startsWith('image/') &&
            !f.fileName?.match(/\.(jpg|jpeg|png|gif|webp)$/i),
        )
        .map((file) => ({
          name: file.fileName,
          url: file.url,
          type: file.contentType || 'application/octet-stream',
        })) || [],
    attachments:
      data.attachments?.map((file) => ({
        id: file.id,
        name: file.fileName,
        fileName: file.fileName,
        url: file.url,
        type: file.contentType || 'application/octet-stream',
        size: file.size || 0,
      })) || [],
    isLiked: data.isLiked || false,
    stats: {
      likeCount: data.reactionCount || 0,
      commentCount: 0,
      viewCount: 0,
    },
    _debugRaw: data.createdDateTime,
  };
};

export const postApi = {
  getPostsByTopic: async (
    topicId: string,
    page = 0,
    size = 10,
  ): Promise<{ content: IPost[]; totalPages: number; number: number; last: boolean }> => {
    const { data } = await apiClient.get<
      ApiResponse<{
        content: PostDto[];
        totalPages: number;
        number: number;
        last: boolean;
      }>
    >(`/posts/topic/${topicId}`, {
      params: { page, size },
    });

    return {
      content: data.result.content.map(mapToIPost),
      totalPages: data.result.totalPages,
      number: data.result.number,
      last: data.result.last,
    };
  },

  // For searching Pending posts (Manager)
  getPendingPostsByTopic: async (
    topicId: string,
    page = 0,
    size = 10,
  ): Promise<{ content: IPost[]; totalPages: number; number: number; last: boolean }> => {
    const { data } = await apiClient.get<
      ApiResponse<{ content: PostDto[]; totalPages: number; number: number; last: boolean }>
    >(`/posts/topic/${topicId}/search`, {
      params: { page, size, postStatus: 'PENDING' },
    });
    return {
      content: data.result.content.map(mapToIPost),
      totalPages: data.result.totalPages,
      number: data.result.number,
      last: data.result.last,
    };
  },

  getNewsfeed: async (params: {
    pageParam?: number;
    size?: number;
    topicId?: string | null;
    authorId?: string | null;
    mode?: string;
    range?: string;
  }): Promise<{ content: IPost[]; totalPages: number; number: number; last: boolean }> => {
    let url = '/posts';
    // If authorId is provided, use the user-specific endpoint which is public/protected correctly
    if (params.authorId) {
      url = `/posts/user/${params.authorId}`;
    }

    const { data } = await apiClient.get<
      ApiResponse<{
        content: PostDto[];
        totalPages: number;
        number: number;
        last: boolean;
      }>
    >(url, {
      params: {
        page: params.pageParam || 0,
        size: params.size || 10,
        topicId: params.topicId,
        // When using /posts/user/:id, we don't need authorId in params
        // But if using /posts (search), we do.
        // Keeping it for /posts case is fine, but for /user/:id it might be ignored or harmless.
        authorId: params.authorId ? undefined : params.authorId,
        sort: params.mode === 'trending' ? 'viewCount,desc' : 'createdDateTime,desc',
      },
    });

    return {
      content: data.result.content.map(mapToIPost),
      totalPages: data.result.totalPages,
      number: data.result.number,
      last: data.result.last,
    };
  },

  createPost: async (
    topicId: string,
    data: { title: string; content: string; images?: string[] },
  ): Promise<IPost> => {
    const payload = {
      title: data.title,
      content: data.content,
      fileMetadataIds: data.images || [],
    };

    const { data: res } = await apiClient.post<ApiResponse<PostDto>>(
      `/posts/topic/${topicId}`,
      payload,
    );
    return mapToIPost(res.result);
  },

  approvePost: async (postId: string): Promise<IPost> => {
    const { data } = await apiClient.put<ApiResponse<PostDto>>(
      `/posts/upgrade-post/${postId}`,
      null,
      {
        params: { postStatus: 'APPROVED' },
      },
    );
    return mapToIPost(data.result);
  },

  rejectPost: async (postId: string): Promise<IPost> => {
    const { data } = await apiClient.put<ApiResponse<PostDto>>(
      `/posts/upgrade-post/${postId}`,
      null,
      {
        params: { postStatus: 'REJECTED' },
      },
    );
    return mapToIPost(data.result);
  },

  increaseView: async (postId: string): Promise<void> => {
    await apiClient.get(`/posts/${postId}`);
  },

  getDetail: async (postId: string): Promise<IPost> => {
    const { data } = await apiClient.get<ApiResponse<PostDto>>(`/posts/${postId}`);
    return mapToIPost(data.result);
  },

  updatePost: async (
    postId: string,
    data: { title: string; content: string; images?: string[] },
  ): Promise<IPost> => {
    const payload = {
      title: data.title,
      content: data.content,
      fileMetadataIds: data.images || [],
    };
    const { data: res } = await apiClient.put<ApiResponse<PostDto>>(`/posts/${postId}`, payload);
    return mapToIPost(res.result);
  },

  getMyPosts: async (
    page = 0,
    size = 10,
  ): Promise<{ content: IPost[]; totalPages: number; number: number; last: boolean }> => {
    const { data } = await apiClient.get<
      ApiResponse<{ content: PostDto[]; totalPages: number; number: number; last: boolean }>
    >('/posts/my-posts', {
      params: { page, size },
    });
    return {
      content: data.result.content.map(mapToIPost),
      totalPages: data.result.totalPages,
      number: data.result.number,
      last: data.result.last,
    };
  },

  delete: async (postId: string): Promise<void> => {
    await apiClient.delete(`/posts/${postId}`);
  },
};

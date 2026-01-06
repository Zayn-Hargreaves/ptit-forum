import { apiClient } from '@shared/api/axios-client';
import { ApiResponse } from '@shared/api/types';
import { IPost } from '../model/types';



// Helper to map BE response to Frontend IPost
const mapToIPost = (data: any): IPost => {
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
            fullName: data.author?.fullName || 'Người dùng ẩn danh',
            avatar: data.author?.avatarUrl || '' 
        },
        createdAt: createdAt,
        postStatus: data.postStatus, // PENDING, APPROVED, REJECTED
        images: data.attachments?.filter((f: any) => f.contentType?.startsWith('image/') || f.fileName?.match(/\.(jpg|jpeg|png|gif|webp)$/i))
            .map((file: any) => file.url) || [], 
        documents: data.attachments?.filter((f: any) => !f.contentType?.startsWith('image/') && !f.fileName?.match(/\.(jpg|jpeg|png|gif|webp)$/i))
            .map((file: any) => ({
                name: file.fileName,
                url: file.url,
                type: file.contentType || 'application/octet-stream'
            })) || [],
        likeCount: data.reactionCount || 0,
        commentCount: 0, // Not provided by BE yet
        viewCount: 0, // Not provided by BE yet
        isLiked: data.isLiked || false,
        stats: {
            likes: data.reactionCount || 0,
            comments: 0,
            views: 0
        }
    };
};

export const postApi = {
  getPostsByTopic: async (topicId: string, page = 0, size = 10): Promise<IPost[]> => {
    const { data } = await apiClient.get<ApiResponse<{
        content: any[] // Use any for raw response to avoid strict type checks on mismatch
    }>>(`/posts/topic/${topicId}`, {
        params: { page, size }
    });
    
    return data.result.content.map(mapToIPost);
  },
  
  // For searching Pending posts (Manager)
  getPendingPostsByTopic: async (topicId: string, page = 0, size = 10): Promise<IPost[]> => {
     const { data } = await apiClient.get<ApiResponse<{ content: any[] }>>(`/posts/topic/${topicId}/search`, {
         params: { page, size, postStatus: 'PENDING' }
     });
     return data.result.content.map(mapToIPost);
  },

  createPost: async (topicId: string, data: { title: string; content: string; images?: string[] }): Promise<IPost> => {
      const payload = {
          title: data.title,
          content: data.content,
          fileMetadataIds: data.images || [] 
      };

      const { data: res } = await apiClient.post<ApiResponse<any>>(`/posts/topic/${topicId}`, payload);
      return mapToIPost(res.result);
  },
  
  approvePost: async (postId: string): Promise<IPost> => {
      const { data } = await apiClient.put<ApiResponse<any>>(`/posts/upgrade-post/${postId}`, null, {
          params: { postStatus: 'APPROVED' }
      });
      return mapToIPost(data.result);
  },

  rejectPost: async (postId: string): Promise<IPost> => {
      const { data } = await apiClient.put<ApiResponse<any>>(`/posts/upgrade-post/${postId}`, null, {
          params: { postStatus: 'REJECTED' }
      });
      return mapToIPost(data.result);
  },

  getPostDetail: async (postId: string): Promise<IPost> => {
      const { data } = await apiClient.get<ApiResponse<any>>(`/posts/${postId}`);
      return mapToIPost(data.result);
  },

  updatePost: async (postId: string, data: { title: string; content: string; images?: string[] }): Promise<IPost> => {
      const payload = {
          title: data.title,
          content: data.content,
          fileMetadataIds: data.images || []
      };
      const { data: res } = await apiClient.put<ApiResponse<any>>(`/posts/${postId}`, payload);
      return mapToIPost(res.result);
  },

  getMyPosts: async (page = 0, size = 10): Promise<IPost[]> => {
      const { data } = await apiClient.get<ApiResponse<{ content: any[] }>>('/posts/my-posts', {
          params: { page, size }
      });
      return data.result.content.map(mapToIPost);
  }
};

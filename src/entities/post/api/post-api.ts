import { apiClient } from "@shared/api/axios-client";
import { ApiResponse, PageResponse } from "@shared/api/types";
import { CreatePostPayload, Post } from "../model/types";

export const postApi = {
  create: async (payload: CreatePostPayload) => {
    const { data } = await apiClient.post<ApiResponse<Post>>(
      `/posts/topic/${payload.topicId}`,
      payload
    );
    return data.result;
  },

  getDetail: async (id: string) => {
    const { data } = await apiClient.get<ApiResponse<Post>>(`/posts/${id}`);
    return data.result;
  },

  getByTopic: async (topicId: string, page = 0, size = 10) => {
    const { data } = await apiClient.get<ApiResponse<PageResponse<Post>>>(
      `/posts/topic/${topicId}`,
      {
        params: { page, size, sort: "createdAt,desc" },
      }
    );
    return data.result;
  },
};

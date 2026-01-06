import { apiClient } from '@shared/api/axios-client';
import { ApiResponse } from '@shared/api/types';

export interface TopicMemberResponse {
  id: string;
  approved: boolean;
  joinedAt: string;
  topicRole: 'MEMBER' | 'MANAGER' | 'OWNER';
  userId: string;
  topicId: string;
  fullName: string;
  avatarUrl?: string;
  email: string;
}

export interface MemberListParams {
  approved?: boolean;
  page?: number;
  size?: number;
}

export const topicMemberApi = {
  /**
   * Join a topic (PUBLIC: auto-approved, PRIVATE: pending)
   */
  joinTopic: async (topicId: string): Promise<TopicMemberResponse> => {
    const { data } = await apiClient.post<ApiResponse<TopicMemberResponse>>(
      `/topic-members/join/${topicId}`,
    );
    return data.result;
  },

  /**
   * Leave/quit a topic
   */
  leaveTopic: async (topicId: string, userId: string): Promise<void> => {
    await apiClient.delete(`/topic-members/${topicId}/kick/${userId}`);
  },

  /**
   * Get members list for a topic with pagination support
   */
  getMembers: async (
    topicId: string,
    params?: MemberListParams,
  ): Promise<{ content: TopicMemberResponse[] }> => {
    const { data } = await apiClient.get<ApiResponse<{ content: TopicMemberResponse[] }>>(
      `/topic-members/topic/${topicId}`,
      { params },
    );
    return data.result;
  },

  /**
   * Approve a pending member (Manager only)
   */
  approveMember: async (memberId: string): Promise<TopicMemberResponse> => {
    const { data } = await apiClient.post<ApiResponse<TopicMemberResponse>>(
      `/topic-members/approve/${memberId}`,
    );
    return data.result;
  },

  /**
   * Kick/remove a member (Manager only)
   */
  removeMember: async (memberId: string): Promise<void> => {
    await apiClient.delete(`/topic-members/remove/${memberId}`);
  },
};

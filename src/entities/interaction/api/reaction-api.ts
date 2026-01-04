import { apiClient } from '@shared/api/axios-client';
import { ApiResponse } from '@shared/api/types';
import { TargetType } from '../model/types';

export type ReactionType = 'LIKE' | 'LOVE' | 'HAHA' | 'WOW' | 'SAD' | 'ANGRY';

export interface ReactionRequest {
  targetId: string;
  targetType: TargetType;
  reactionType: ReactionType;
}

export interface ReactionResponse {
  reacted: boolean;
  type: ReactionType;
  totalReactions: number;
}

export const reactionApi = {
  toggle: async (payload: ReactionRequest) => {
    const { data } = await apiClient.post<ApiResponse<ReactionResponse>>('/reactions/toggle', payload);
    return data.result;
  },
};

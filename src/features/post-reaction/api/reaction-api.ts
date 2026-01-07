import { apiClient } from '@shared/api/axios-client';
import { ApiResponse } from '@shared/api/types';
import { ReactionRequest } from '../model/types';

export const reactionApi = {
  toggleReaction: async (data: ReactionRequest): Promise<boolean> => {
    // Endpoint: POST /api/reactions
    // Returns "Success" string in result, not boolean.
    // We assume 200 OK means success.
    
    await apiClient.post<ApiResponse<string>>('/reactions', data);
    return true; 
  }
};

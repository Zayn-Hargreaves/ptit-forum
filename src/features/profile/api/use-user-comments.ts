import { commentService } from '@shared/api/comment.service';
import { useQuery } from '@tanstack/react-query';

export const commentKeys = {
  all: ['comments'] as const,
  user: (userId: string, params: { page?: number; limit?: number }) =>
    [...commentKeys.all, 'user', userId, params] as const,
};

export function useUserComments(userId: string, params: { page?: number; limit?: number } = {}) {
  return useQuery({
    queryKey: commentKeys.user(userId, params),
    queryFn: () => commentService.getUserComments(userId, params),
    enabled: !!userId,
  });
}

import { getUserStats } from '@shared/api/user.service';
import { useQuery } from '@tanstack/react-query';

export const userStatsKeys = {
  all: ['userStats'] as const,
  detail: (userId: string) => [...userStatsKeys.all, userId] as const,
};

export function useUserStats(userId: string) {
  return useQuery({
    queryKey: userStatsKeys.detail(userId),
    queryFn: () => getUserStats(userId),
    enabled: !!userId,
  });
}

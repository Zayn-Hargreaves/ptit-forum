import { useQuery } from '@tanstack/react-query';

import { getUserProfile } from './api/user-api';

export const useUserProfile = (userId: string) => {
  return useQuery({
    queryKey: ['profile', userId],
    queryFn: () => getUserProfile(userId),
    enabled: !!userId,
  });
};

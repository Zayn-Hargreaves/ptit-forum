import { UserProfile } from '@entities/session/model/types';
import { followUser, unfollowUser } from '@entities/user/api/user-api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner'; // Assuming sonner is used, or replace with appropriate toast

export function useFollow(targetUserId: string) {
  const queryClient = useQueryClient();

  const follow = useMutation({
    mutationFn: () => followUser(targetUserId),

    onMutate: async () => {
      // Cancel outbound refetches
      await queryClient.cancelQueries({ queryKey: ['profile', targetUserId] });

      // Snapshot previous value
      const previousProfile = queryClient.getQueryData<UserProfile>(['profile', targetUserId]);

      // Optimistic Update
      if (previousProfile) {
        const newFollowerCount = (previousProfile.stats?.followerCount || 0) + 1;

        queryClient.setQueryData<UserProfile>(['profile', targetUserId], {
          ...previousProfile,
          stats: {
            ...previousProfile.stats!,
            followerCount: newFollowerCount,
            docCount: previousProfile.stats?.docCount || 0,
            postCount: previousProfile.stats?.postCount || 0,
          },
          isFollowing: true,
        });
      }

      return { previousProfile };
    },

    onError: (err, variables, context) => {
      if (context?.previousProfile) {
        queryClient.setQueryData(['profile', targetUserId], context.previousProfile);
      }
      toast.error('Thao tác thất bại. Vui lòng thử lại.');
    },

    onSettled: () => {
      // queryClient.invalidateQueries({ queryKey: ['profile', targetUserId] });
    },
  });

  const unfollow = useMutation({
    mutationFn: () => unfollowUser(targetUserId),

    onMutate: async () => {
      // Cancel outbound refetches
      await queryClient.cancelQueries({ queryKey: ['profile', targetUserId] });

      // Snapshot previous value
      const previousProfile = queryClient.getQueryData<UserProfile>(['profile', targetUserId]);

      // Optimistic Update
      if (previousProfile) {
        const newFollowerCount = (previousProfile.stats?.followerCount || 0) - 1;

        queryClient.setQueryData<UserProfile>(['profile', targetUserId], {
          ...previousProfile,
          stats: {
            ...previousProfile.stats!,
            followerCount: newFollowerCount < 0 ? 0 : newFollowerCount,
            docCount: previousProfile.stats?.docCount || 0,
            postCount: previousProfile.stats?.postCount || 0,
          },
          isFollowing: false,
        });
      }

      return { previousProfile };
    },

    onError: (err, variables, context) => {
      if (context?.previousProfile) {
        queryClient.setQueryData(['profile', targetUserId], context.previousProfile);
      }
      toast.error('Thao tác thất bại. Vui lòng thử lại.');
    },

    onSettled: () => {
      // queryClient.invalidateQueries({ queryKey: ['profile', targetUserId] });
    },
  });

  return { follow, unfollow };
}

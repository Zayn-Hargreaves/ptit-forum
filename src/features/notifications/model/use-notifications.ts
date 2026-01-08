import { useInfiniteQuery, useQuery } from '@tanstack/react-query';

import { notificationApi } from '@/entities/notification/api/notification-api';

export const NOTIFICATION_KEYS = {
  all: ['notifications'] as const,
  list: () => [...NOTIFICATION_KEYS.all, 'list'] as const,
  unreadCount: () => [...NOTIFICATION_KEYS.all, 'unread-count'] as const,
};

export const useNotifications = () => {
  return useInfiniteQuery({
    queryKey: NOTIFICATION_KEYS.list(),
    queryFn: async ({ pageParam = 0 }) => {
      const response = await notificationApi.getNotifications(pageParam);
      // [use-notifications.ts] Debug log
      console.log('[use-notifications.ts] API response for page', pageParam, ':', response);
      console.log('[use-notifications.ts] Content array:', response.content);
      return response;
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      // Backend returns 'number' (current page) and 'last' (is last page)
      return lastPage.last ? undefined : lastPage.number + 1;
    },
  });
};

export const useUnreadCount = () => {
  return useQuery({
    queryKey: NOTIFICATION_KEYS.unreadCount(),
    queryFn: notificationApi.getUnreadCount,
    // Refetch every 1 minute to sync if socket misses (Safety net)
    refetchInterval: 60000,
  });
};

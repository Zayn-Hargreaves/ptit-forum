// src/entities/post/model/use-infinite-posts.ts
import { useInfiniteQuery } from '@tanstack/react-query';
import { postApi } from '../api/post-api';

export type SortMode = 'latest' | 'trending';
export type TimeRange = 'week' | 'month' | 'all';

interface UseInfinitePostsProps {
  topicId?: string | null;
  authorId?: string | null;
  sortMode?: SortMode;
  timeRange?: TimeRange;
}

const TIME_RANGE_MAP: Record<TimeRange, 'WEEK' | 'MONTH' | 'ALL'> = {
  week: 'WEEK',
  month: 'MONTH',
  all: 'ALL',
};

export function useInfinitePosts({ topicId = null, authorId = null, sortMode = 'latest', timeRange = 'week' }: UseInfinitePostsProps) {
  const apiRange = TIME_RANGE_MAP[timeRange];

  return useInfiniteQuery({
    queryKey: ['posts', 'feed', topicId, authorId, sortMode, apiRange],

    queryFn: ({ pageParam = 0 }) =>
      postApi.getNewsfeed({
        pageParam,
        size: 10,
        topicId,
        authorId,
        mode: sortMode,
        range: apiRange,
      }),

    initialPageParam: 0,

    getNextPageParam: (lastPage) => (lastPage?.last ? undefined : (lastPage?.number ?? 0) + 1),

    select: (data) => ({
      pages: data.pages,
      pageParams: data.pageParams,
      posts: data.pages.flatMap((page) => page.content ?? []),
    }),

    placeholderData: (previousData) => previousData,
  });
}

import { useQuery } from "@tanstack/react-query";
import { fetchTrendingPosts } from "../api/fetch-trending";

export const postQueries = {
  trending: () => ({
    queryKey: [
      "post",
      "trending",
      { size: 3, sort: "reactionCount,desc" },
    ] as const,
    queryFn: fetchTrendingPosts,
    staleTime: 60 * 1000,
    retry: 1,
  }),
};

export function useTrendingPosts() {
  return useQuery(postQueries.trending());
}

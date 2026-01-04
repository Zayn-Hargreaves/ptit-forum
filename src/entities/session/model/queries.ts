import { useQuery, useQueryClient } from "@tanstack/react-query";
import { sessionApi } from "../api/session-api";
import { sessionKeys } from "../lib/query-keys";

export const useMe = (options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: sessionKeys.me(),
    queryFn: sessionApi.me,
    staleTime: 1000 * 60 * 5,
    retry: false,
    enabled: options?.enabled,
  });
};

export const useInvalidateMe = () => {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: sessionKeys.me() });
};

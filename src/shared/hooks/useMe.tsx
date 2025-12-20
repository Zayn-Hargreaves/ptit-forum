import apiClient from "@shared/lib/axios";
import type { ApiResponse, UserAuthResponse } from "@shared/types/auth";
import { useQuery } from "@tanstack/react-query";

export const useMe = (options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const { data } = await apiClient.get<ApiResponse<UserAuthResponse>>(
        "/users/me"
      );
      return data.result;
    },
    staleTime: 5 * 60 * 1000,
    retry: false,
    ...options,
  });
};

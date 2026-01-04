import { useQuery } from "@tanstack/react-query";
import { User } from "@shared/types/auth";
import apiClient from "@shared/lib/axios";

export const useMe = () =>
  useQuery<User | null>({
    queryKey: ["me"],
    queryFn: async () => {
      try {
        const { data } = await apiClient.get<{ user: User | null }>("/auth/me");
        return data.user ?? null;
      } catch {
        return null;
      }
    },
    staleTime: Infinity,
    retry: false,
  });

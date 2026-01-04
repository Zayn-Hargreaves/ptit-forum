import apiClient from "@shared/lib/axios";

export type ProfileResponse = { id: string; email: string; name?: string };

export const userApi = {
  me: async () => {
    const { data } = await apiClient.get<ProfileResponse>("/users/me");
    return data;
  },
};

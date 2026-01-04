import { apiClient } from "@shared/api/axios-client";
import { User } from "../model/types";
import { ApiResponse } from "@shared/api";

export const sessionApi = {
  me: async () => {
    const { data } = await apiClient.get<ApiResponse<User>>("/users/me");
    return data.result;
  },

  logout: async () => {
    await apiClient.post("/auth/logout");
  },
};

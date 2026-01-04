import { apiClient } from "@shared/api/axios-client";

export type RegisterPayload = {
  email: string;
  password: string;
  confirmPassword: string;
};

export type VerifyEmailPayload = {
  email: string;
  verificationCode: string;
};

export const authApi = {
  login: async (payload: { email: string; password: string }) => {
    const { data } = await apiClient.post("/auth/login", payload);
    // Token is now handled by HttpOnly Cookie via Next.js Proxy
    return data;
  },

  register: async (payload: RegisterPayload) => {
    const { data } = await apiClient.post("/users/register", payload);
    return data;
  },

  verifyEmail: async (payload: VerifyEmailPayload) => {
    const { data } = await apiClient.post("/users/verify", payload);
    return data;
  },

  resendVerifyCode: async (email: string) => {
    const { data } = await apiClient.post("/users/resend", null, {
      params: { email },
    });
    return data;
  },
};

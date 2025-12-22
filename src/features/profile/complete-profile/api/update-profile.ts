import { apiClient } from "@shared/api";

export type UpdateProfilePayload = {
  name: string;
  studentId: string;
  faculty: string;
  class: string;
};

export const updateProfile = async (payload: UpdateProfilePayload) => {
  const { data } = await apiClient.patch("/users/me", payload);
  return data.result;
};

import { User } from "../model/types";

export const isProfileComplete = (user: User | null | undefined): boolean => {
  if (!user) return false;
  return !!(user.fullName && user.studentId && user.className && user.faculty);
};

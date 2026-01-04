import { User } from "../model/types";

export const isProfileComplete = (user: User): boolean => {
  return !!(user.studentCode && user.classCode && user.fullName);
};

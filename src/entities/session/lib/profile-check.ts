import { UserProfile } from '../model/types';

export const isProfileComplete = (user: UserProfile): boolean => {
  return !!(user.studentCode && user.classCode && user.fullName);
};

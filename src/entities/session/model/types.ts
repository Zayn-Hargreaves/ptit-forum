export const PERMISSIONS = {
  READ_ALL: 'read_all',
  READ_ANY: 'read_any',
  CREATE_ALL: 'create_all',
  CREATE_ANY: 'create_any',
  UPDATE_ALL: 'update_all',
  UPDATE_ANY: 'update_any',
  DELETE_ALL: 'delete_all',
  DELETE_ANY: 'delete_any',
} as const;

export type UserPermission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

export interface User {
  id: string;
  email: string;

  fullName: string;
  avatarUrl?: string;
  role: 'USER' | 'ADMIN';

  permissions?: UserPermission[];
}

export interface UserStats {
  postCount: number;
  docCount: number;
  followerCount: number;
  followingCount: number;
}

export interface UserProfile extends User {
  facultyName?: string;
  bio?: string;
  studentCode?: string;
  classCode?: string;
  phone?: string;
  stats?: UserStats;
  isOwnProfile?: boolean;
  isFollowing?: boolean;
}

export interface UpdateProfilePayload {
  fullName?: string;
  phone?: string;
  studentCode?: string;
  classCode?: string;
}

export interface UserProfileResponseDto {
  id: string;
  email: string;
  fullName: string;
  avatarUrl: string;
  studentCode: string;
  classCode: string;
  phone: string;
  facultyName: string;
}

export function mapUserProfileResponseDtoToUserProfile(dto: UserProfileResponseDto): UserProfile {
  return {
    id: dto.id,
    email: dto.email,
    fullName: dto.fullName,
    avatarUrl: dto.avatarUrl || undefined,
    studentCode: dto.studentCode || undefined,
    classCode: dto.classCode || undefined,
    phone: dto.phone || undefined,
    facultyName: dto.facultyName || undefined,
    role: 'USER', // Default role for DTO mapping if not present
  };
}

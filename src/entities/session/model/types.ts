export const PERMISSIONS = {
  READ_ALL: "read_all",
  READ_ANY: "read_any",
  CREATE_ALL: "create_all",
  CREATE_ANY: "create_any",
  UPDATE_ALL: "update_all",
  UPDATE_ANY: "update_any",
  DELETE_ALL: "delete_all",
  DELETE_ANY: "delete_any",
} as const;

export type UserPermission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

export interface User {
  id: string;
  email: string;

  fullName: string;
  avatar: string;

  phone: string;
  studentCode: string;
  classCode: string;
  facultyName: string;

  permissions?: UserPermission[];
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

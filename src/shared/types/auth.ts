export type UserPermission =
  | "read_all"
  | "read_any"
  | "create_all"
  | "create_any"
  | "update_all"
  | "update_any"
  | "delete_all"
  | "delete_any";

export interface UserAuthResponse {
  id: string;
  email: string;
  fullName: string;
  avatar: string | null;
  permissions: UserPermission[];
}

export type AuthUser = UserAuthResponse;

export interface ApiResponse<T> {
  code: number;
  message: string;
  result: T;
}

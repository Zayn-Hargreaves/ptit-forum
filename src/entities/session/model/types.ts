export type UserPermission =
  | "read_all"
  | "read_any"
  | "create_all"
  | "create_any"
  | "update_all"
  | "update_any"
  | "delete_all"
  | "delete_any";

export interface User {
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string;

  studentId?: string;
  className?: string;
  faculty?: string;

  createdAt: string;
  permissions: UserPermission[];
}

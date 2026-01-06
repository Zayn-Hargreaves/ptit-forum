export interface Role {
  name: string;
  description: string;
  permissions: Permission[];
}

export interface Permission {
  name: string;
  description: string;
}

export interface User {
  id: string;
  email: string;
  fullName: string;
  enabled: boolean;
  avatarUrl?: string;
  phone?: string;
  provider?: string;
  studentCode?: string;
  classCode?: string;
  registrationDate?: string;
  roles?: Role[];
}

export interface SearchUserParams {
  page?: number;
  size?: number;
  sort?: string[];
  email?: string;
  fullName?: string;
  enable?: boolean;
  studentCode?: string;
  classCode?: string;
}

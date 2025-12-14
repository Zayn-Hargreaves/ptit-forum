export interface User {
  id: string;
  email: string;
  name?: string;
  permissions: string[];
}

export interface MeResponse {
  user: User;
}
export interface LoginResponse {
  user: User;
}

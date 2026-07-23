export type UserRoleName = "admin" | "viewer";

export interface AuthUser {
  username: string;
  role: UserRoleName;
}

export interface LoginResponse {
  token: string;
  username: string;
  role: UserRoleName;
}

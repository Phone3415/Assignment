export type UserRole = "Student" | "Admin";

export interface User {
  id: number;
  studentId: string;
  name: string;
  role: UserRole;
  createdAt: string;
}

export interface JWTData {
  id: number;
  studentId: string;
  name: string;
  role: UserRole;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: JWTData;
}

export interface LoginResult {
  success: boolean;
  error?: string;
}

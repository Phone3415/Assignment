import { useCallback } from "react";
import { User, UserRole } from "../Types/auth.type";
import useApiFetch from "./Api.hook";

export interface UserResponse {
  success: boolean;
  data?: User;
  error?: string;
}

export interface UseUsersReturn {
  fetchUsers: (
    search?: string,
    role?: UserRole,
    cursor?: string,
    size?: number
  ) => Promise<{ data: User[]; totalPages: number }>;
  createUser: (data: {
    studentId: string;
    name: string;
    role: UserRole;
  }) => Promise<UserResponse>;
  updateUser: (
    id: number,
    data: {
      studentId?: string;
      name?: string;
      role?: UserRole;
    }
  ) => Promise<UserResponse>;
  deleteUser: (id: number) => Promise<UserResponse>;
}

export const useUsers = (): UseUsersReturn => {
  const apiFetch = useApiFetch();

  const fetchUsers = useCallback(
    async (
      search?: string,
      role?: UserRole,
      cursor?: string,
      size: number = 50
    ): Promise<{ data: User[]; totalPages: number }> => {
      try {
        const query = new URLSearchParams();
        if (search) query.append("search", search);
        if (role) query.append("role", role);
        if (cursor) query.append("cursor", cursor);
        if (size) query.append("size", size.toString());

        const response = await apiFetch(`/api/users?${query.toString()}`);
        if (!response.ok) return { data: [], totalPages: 1 };
        const json = await response.json();
        return { data: json?.data || [], totalPages: json?.totalPages || 1 };
      } catch (err) {
        console.error("Failed to fetch users:", err);
        return { data: [], totalPages: 1 };
      }
    },
    [apiFetch]
  );

  const createUser = useCallback(
    async (data: {
      studentId: string;
      name: string;
      role: UserRole;
    }): Promise<UserResponse> => {
      try {
        const response = await apiFetch("/api/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        const json = await response.json();
        
        if (!response.ok) {
          return { success: false, error: json.error || "Failed to create user" };
        }
        return { success: true, data: json.data };
      } catch (err: unknown) {
        return {
          success: false,
          error: err instanceof Error ? err.message : "เกิดข้อผิดพลาดในการเชื่อมต่อ",
        };
      }
    },
    [apiFetch]
  );

  const updateUser = useCallback(
    async (
      id: number,
      data: {
        studentId?: string;
        name?: string;
        role?: UserRole;
      }
    ): Promise<UserResponse> => {
      try {
        const response = await apiFetch(`/api/users/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        const json = await response.json();

        if (!response.ok) {
          return { success: false, error: json.error || "Failed to update user" };
        }
        return { success: true, data: json.data };
      } catch (err: unknown) {
        return {
          success: false,
          error: err instanceof Error ? err.message : "เกิดข้อผิดพลาดในการเชื่อมต่อ",
        };
      }
    },
    [apiFetch]
  );

  const deleteUser = useCallback(
    async (id: number): Promise<UserResponse> => {
      try {
        const response = await apiFetch(`/api/users/${id}`, {
          method: "DELETE",
        });
        const json = await response.json();
        
        if (!response.ok) {
          return { success: false, error: json.error || "Failed to delete user" };
        }
        return { success: true };
      } catch (err: unknown) {
        return {
          success: false,
          error: err instanceof Error ? err.message : "เกิดข้อผิดพลาดในการเชื่อมต่อ",
        };
      }
    },
    [apiFetch]
  );

  return {
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
  };
};

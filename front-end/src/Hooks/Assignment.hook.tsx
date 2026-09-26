import { useCallback, useRef, useState } from "react";
import { AssignmentData, AssignmentStatus, AssignmentType } from "../Types/assignment.type";
import useApiFetch from "./Api.hook";

export interface AssignmentFilters {
  page?: number;
  search?: string;
  status?: AssignmentStatus | "";
}

export function useAssignments(classId: number) {
  const apiFetch = useApiFetch();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [assignments, setAssignments] = useState<AssignmentData[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);

  // Maps JSON.stringify(filters) to a map of page numbers to their cursors
  const cursorsMap = useRef<Record<string, Record<number, string | undefined>>>({});

  const getAssignments = useCallback(
    async (filters: AssignmentFilters = {}) => {
      const { page = 1, search = "", status = "" } = filters;
      const normalizedSearch = search.trim();
      const filterKey = JSON.stringify({ search: normalizedSearch, status });

      if (!cursorsMap.current[filterKey]) {
        cursorsMap.current[filterKey] = { 1: undefined };
      }

      const cursor = cursorsMap.current[filterKey][page];

      setIsLoading(true);
      setError(null);

      try {
        const query = new URLSearchParams();
        if (cursor) query.set("cursor", cursor);
        if (normalizedSearch) query.set("search", normalizedSearch);
        if (status) query.set("status", status);

        const response = await apiFetch(`/api/assignments/${classId}?${query.toString()}`);
        if (!response.ok) {
          throw new Error("ไม่สามารถโหลดข้อมูลงานได้ กรุณาลองใหม่อีกครั้ง");
        }

        const json = await response.json();
        const data: AssignmentData[] = json.data || [];

        if (data.length > 0) {
          const lastItem = data[data.length - 1];
          cursorsMap.current[filterKey][page + 1] = `${lastItem.id}__$__${lastItem.createdAt}`;
          setHasMore(data.length === 10); // Assuming default size 10
        } else {
          setHasMore(false);
        }

        setAssignments(data);
        setCurrentPage(page);
        return data;
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "เกิดข้อผิดพลาดในการโหลดข้อมูล";
        setError(message);
        return [];
      } finally {
        setIsLoading(false);
      }
    },
    [apiFetch, classId]
  );

  const clearCache = useCallback((): void => {
    cursorsMap.current = {};
  }, []);

  const clearError = useCallback((): void => {
    setError(null);
  }, []);

  const createAssignment = useCallback(
    async (data: {
      name: string;
      description: string;
      deadline?: string | Date;
      assignedDate: string | Date;
      type: AssignmentType;
      groupSize?: number;
    }) => {
      try {
        const response = await apiFetch(`/api/assignments/${classId}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          const json = await response.json();
          return { success: false, error: json.error || "ไม่สามารถสร้างงานได้" };
        }
        clearCache();
        return { success: true };
      } catch (err: unknown) {
        return { success: false, error: err instanceof Error ? err.message : "เกิดข้อผิดพลาดในการเชื่อมต่อ" };
      }
    },
    [apiFetch, classId, clearCache]
  );

  const editAssignment = useCallback(
    async (
      id: number,
      data: Partial<{
        name: string;
        description: string;
        deadline?: string | Date | null;
        assignedDate?: string | Date;
        type?: AssignmentType;
        groupSize?: number;
      }>
    ) => {
      try {
        const response = await apiFetch(`/api/assignments/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          const json = await response.json();
          return { success: false, error: json.error || "ไม่สามารถแก้ไขงานได้" };
        }
        clearCache();
        return { success: true };
      } catch (err: unknown) {
        return { success: false, error: err instanceof Error ? err.message : "เกิดข้อผิดพลาดในการเชื่อมต่อ" };
      }
    },
    [apiFetch, clearCache]
  );

  const deleteAssignment = useCallback(
    async (id: number) => {
      try {
        const response = await apiFetch(`/api/assignments/${id}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          const json = await response.json();
          return { success: false, error: json.error || "ไม่สามารถลบงานได้" };
        }
        clearCache();
        return { success: true };
      } catch (err: unknown) {
        return { success: false, error: err instanceof Error ? err.message : "เกิดข้อผิดพลาดในการเชื่อมต่อ" };
      }
    },
    [apiFetch, clearCache]
  );

  const submitAssignment = useCallback(
    async (id: number) => {
      try {
        const response = await apiFetch(`/api/assignments/${classId}/${id}/submit`, {
          method: "PUT",
        });
        if (!response.ok) {
          const json = await response.json().catch(() => ({}));
          throw new Error(json.error || "ส่งงานไม่สำเร็จ");
        }
        return { success: true };
      } catch (err: unknown) {
        return { success: false, error: err instanceof Error ? err.message : "เกิดข้อผิดพลาดในการเชื่อมต่อ" };
      }
    },
    [apiFetch, classId]
  );

  const unsubmitAssignment = useCallback(
    async (id: number) => {
      try {
        const response = await apiFetch(`/api/assignments/${classId}/${id}/unsubmit`, {
          method: "PUT",
        });
        if (!response.ok) {
          const json = await response.json().catch(() => ({}));
          throw new Error(json.error || "ยกเลิกการส่งงานไม่สำเร็จ");
        }
        return { success: true };
      } catch (err: unknown) {
        return { success: false, error: err instanceof Error ? err.message : "เกิดข้อผิดพลาดในการเชื่อมต่อ" };
      }
    },
    [apiFetch, classId]
  );

  const totalPages = hasMore ? currentPage + 1 : currentPage;

  return {
    isLoading,
    error,
    assignments,
    currentPage,
    totalPages,
    hasMore,
    getAssignments,
    createAssignment,
    editAssignment,
    deleteAssignment,
    submitAssignment,
    unsubmitAssignment,
    clearCache,
    clearError,
  };
}

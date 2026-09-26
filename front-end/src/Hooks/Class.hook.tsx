import { useCallback, useRef, useState } from "react";
import {
  CacheData,
  ClassData,
  ClassListResponse,
  UseClassesReturn,
} from "../Types";
import useApiFetch from "./Api.hook";

export function useClasses(): UseClassesReturn {
  const apiFetch = useApiFetch();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [classes, setClasses] = useState<ClassData[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  const cache = useRef<Record<string, CacheData>>({});
  // Maps a search string to a map of page numbers to their cursors
  const cursorsMap = useRef<Record<string, Record<number, string | undefined>>>(
    {},
  );

  const getAllClasses = useCallback(
    async (page: number = 1, search: string = ""): Promise<ClassData[]> => {
      const normalizedSearch = search.trim();

      if (!cursorsMap.current[normalizedSearch]) {
        cursorsMap.current[normalizedSearch] = { 1: undefined };
      }

      const cursor = cursorsMap.current[normalizedSearch][page];

      const query = new URLSearchParams();
      if (cursor) query.set("cursor", cursor);
      if (normalizedSearch) query.set("search", normalizedSearch);

      const cacheKey = query.toString();

      // Return cached results if available
      if (cache.current[cacheKey]) {
        const cached = cache.current[cacheKey];
        setClasses(cached.data);
        setCurrentPage(page);
        setTotalPages(cached.totalPages);
        setError(null);
        return cached.data;
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await apiFetch(`/api/classes?${cacheKey}`);
        if (!response.ok) {
          throw new Error(
            "ไม่สามารถโหลดข้อมูลวิชาเรียนได้ กรุณาลองใหม่อีกครั้ง",
          );
        }

        const json: ClassListResponse = await response.json();
        const data = json.data || [];
        const returnedTotalPages = json.totalPages || 1;

        if (data.length > 0) {
          const lastClass = data[data.length - 1];
          cursorsMap.current[normalizedSearch][page + 1] =
            `${lastClass.id}__$__${lastClass.createdAt}`;
        }

        const cachedData: CacheData = {
          data,
          page,
          totalPages: returnedTotalPages,
        };

        cache.current[cacheKey] = cachedData;
        setClasses(data);
        setCurrentPage(page);
        setTotalPages(returnedTotalPages);

        return data;
      } catch (err: unknown) {
        const message =
          err instanceof Error
            ? err.message
            : "เกิดข้อผิดพลาดในการโหลดข้อมูลวิชาเรียน";
        setError(message);
        return [];
      } finally {
        setIsLoading(false);
      }
    },
    [apiFetch],
  );

  const clearCache = useCallback((): void => {
    cache.current = {};
    cursorsMap.current = {};
  }, []);

  const clearError = useCallback((): void => {
    setError(null);
  }, []);

  const createClass = useCallback(
    async (name: string): Promise<{ success: boolean; error?: string }> => {
      try {
        const response = await apiFetch("/api/classes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name }),
        });

        if (!response.ok) {
          const json = await response.json();
          return {
            success: false,
            error: json.error || "ไม่สามารถสร้างรายวิชาได้",
          };
        }

        return { success: true };
      } catch (err: unknown) {
        return {
          success: false,
          error:
            err instanceof Error ? err.message : "เกิดข้อผิดพลาดในการเชื่อมต่อ",
        };
      }
    },
    [apiFetch],
  );

  const editClass = useCallback(
    async (
      id: number,
      name: string,
    ): Promise<{ success: boolean; error?: string }> => {
      try {
        const response = await apiFetch(`/api/classes/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name }),
        });

        if (!response.ok) {
          const json = await response.json();
          return {
            success: false,
            error: json.error || "ไม่สามารถแก้ไขรายวิชาได้",
          };
        }

        return { success: true };
      } catch (err: unknown) {
        return {
          success: false,
          error:
            err instanceof Error ? err.message : "เกิดข้อผิดพลาดในการเชื่อมต่อ",
        };
      }
    },
    [apiFetch],
  );

  const deleteClass = useCallback(
    async (id: number): Promise<{ success: boolean; error?: string }> => {
      try {
        const response = await apiFetch(`/api/classes/${id}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          const json = await response.json();
          return {
            success: false,
            error: json.error || "ไม่สามารถลบรายวิชาได้",
          };
        }

        return { success: true };
      } catch (err: unknown) {
        return {
          success: false,
          error:
            err instanceof Error ? err.message : "เกิดข้อผิดพลาดในการเชื่อมต่อ",
        };
      }
    },
    [apiFetch],
  );

  return {
    isLoading,
    error,
    classes,
    getAllClasses,
    createClass,
    editClass,
    deleteClass,
    currentPage,
    totalPages,
    clearCache,
    clearError,
  };
}

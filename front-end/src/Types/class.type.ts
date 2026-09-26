export interface ClassData {
  id: number;
  name: string;
  createdAt: string;
}

export interface ClassListResponse {
  data: ClassData[];
  totalPages: number;
  nextCursor?: string;
}

export interface CacheData {
  data: ClassData[];
  page: number;
  totalPages: number;
}

export interface UseClassesReturn {
  isLoading: boolean;
  error: string | null;
  classes: ClassData[];
  currentPage: number;
  totalPages: number;
  getAllClasses: (page?: number, search?: string) => Promise<ClassData[]>;
  createClass: (name: string) => Promise<{ success: boolean; error?: string }>;
  editClass: (
    id: number,
    name: string,
  ) => Promise<{ success: boolean; error?: string }>;
  deleteClass: (id: number) => Promise<{ success: boolean; error?: string }>;
  clearCache: () => void;
  clearError: () => void;
}

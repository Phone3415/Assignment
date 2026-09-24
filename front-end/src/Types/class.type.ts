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

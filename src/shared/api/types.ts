export type ApiResponse<T> = {
  code: number; // Senior requested 'code'
  result: T;
  message?: string;
  statusCode?: number; // Kept for backward compatibility if needed
};

export type PaginatedResponse<T> = {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages?: number;
  };
};

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

export type ApiResponse<T> = {
  result: T;
  message?: string;
  statusCode?: number;
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

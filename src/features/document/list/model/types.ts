export interface DocumentListParams {
  page?: number;
  limit?: number;
  subjectId?: string;
  sort?: 'popular' | 'newest';
}

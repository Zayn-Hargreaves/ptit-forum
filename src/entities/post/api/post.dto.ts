export interface BackendPostDTO {
  id: number;
  uuid?: string;

  title: string;

  createdBy?: {
    id: number;
    name: string;
    avatarUrl?: string;
  };

  authorName?: string;

  commentCount: number;
  viewCount: number;

  categoryName: string;
  createdAt: string;
}

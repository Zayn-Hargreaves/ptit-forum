export type TrendingPost = {
  id: string;
  title: string;
  author: {
    id?: string;
    name: string;
    avatar?: string;
  };
  category: string;
  comments: number;
  views: number;
  createdAt?: string;
};

// src/entities/post/model/types.ts

export type PostStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "DRAFT"
  | "ARCHIVED"
  | "DELETED";

export type FileType = "IMAGE" | "VIDEO" | "DOCUMENT";

export interface PostAuthor {
  id: string;
  name: string;
  avatarUrl: string;
  badge?: string;
}

export interface PostAttachment {
  id: string;
  url: string;
  name: string;
  type: FileType;
  size?: number;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  excerpt?: string;
  slug: string;

  status: PostStatus;

  author: PostAuthor;
  topicId: string;

  viewCount: number;
  commentCount: number;
  reactionCount: number;

  attachments: PostAttachment[];
  createdAt: string;
  updatedAt?: string;

  isLiked?: boolean;
  isSaved?: boolean;
}

export interface CreatePostPayload {
  title: string;
  content: string;
  fileMetadataIds: string[];
  topicId: string;
}

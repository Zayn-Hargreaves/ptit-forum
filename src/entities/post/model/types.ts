export type PostStatus = 'APPROVED' | 'PENDING' | 'REJECTED';

export interface IPost {
  id: string;
  title: string;
  content: string;
  author: {
    id: string;
    fullName: string;
    avatarUrl?: string;
    badge?: string;
    faculty?: string;
  };
  createdAt: string;
  postStatus?: PostStatus;
  images?: string[];
  documents?: { name: string; url: string; type: string }[];
  topic?: { id: string; name: string };
  stats?: {
    viewCount?: number;
    commentCount?: number;
    likeCount?: number;
  };
  permissions?: {
    canEdit?: boolean;
    canDelete?: boolean;
    canReport?: boolean;
  };
  attachments?: {
    id: string;
    name: string;
    fileName: string;
    url: string;
    type: string;
    size?: number;
  }[];
  isLiked?: boolean;
  _debugRaw?: unknown;
}

export type Post = IPost;
export type PostAttachment = NonNullable<IPost['attachments']>[number];

export interface TrendingPost {
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
}

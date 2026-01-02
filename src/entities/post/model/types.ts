export type PostStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'DRAFT' | 'ARCHIVED' | 'DELETED';
export type FileType = 'IMAGE' | 'VIDEO' | 'DOCUMENT';

export interface PostAuthor {
  id: string;
  fullName: string;
  avatarUrl: string;
  badge: string;
  faculty: string;
}

export interface PostStats {
  viewCount: number;
  commentCount: number;
  reactionCount: number;
}

export interface PostUserState {
  liked: boolean;
  saved: boolean;
  following: boolean;
}

export interface PostPermissions {
  canEdit: boolean;
  canDelete: boolean;
  canReport: boolean;
}

export interface PostAttachment {
  id: string;
  url: string;
  name: string;
  type: FileType;
  size?: number;
}

export interface PostTopic {
  id: string;
  name: string;
  slug: string | null;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  excerpt?: string;
  slug: string | null;
  topicId: string;

  topic?: PostTopic;

  createdDateTime: string;
  lastModifiedDateTime?: string;
  approvedAt?: string;
  postStatus: PostStatus;

  author: PostAuthor;
  stats: PostStats;
  userState: PostUserState;
  permissions: PostPermissions;
  attachments: PostAttachment[];
}

export interface CreatePostPayload {
  title: string;
  content: string;
  fileMetadataIds: string[];
  topicId: string;
}

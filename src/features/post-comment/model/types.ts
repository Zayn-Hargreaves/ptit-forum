export interface IComment {
  id: string;
  content: string;
  author: {
    id: string;
    fullName: string;
    avatar: string;
  };
  createdAt: string;
  replyCount?: number;
  // New fields
  postId: string;
  isLiked?: boolean;
  reactionCount?: number;
  parentId?: string | null;
  permissions?: {
    canEdit: boolean;
    canDelete: boolean;
    canReport: boolean;
  };
  commentCreator?: boolean;
}

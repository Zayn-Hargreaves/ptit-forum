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
}

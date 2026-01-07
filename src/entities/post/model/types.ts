export type PostStatus = 'APPROVED' | 'PENDING' | 'REJECTED';

export interface IPost {
  id: string;
  title: string;
  content: string;
  author: {
    id: string;
    fullName: string;
    avatar?: string;
  };
  createdAt: string;
  postStatus?: PostStatus; // Post approval status
  images?: string[];
  documents?: { name: string; url: string; type: string }[]; // Added documents field
  likeCount: number; // Changed from stats object to flat fields based on view
  commentCount: number;
  viewCount: number;
  stats?: { // Keep stats for backward prop compatibility if needed, but flatter is better usually.
      likes: number;
      comments: number;
      views: number;
  }; 
  attachments?: {
    id: string;
    name: string; // Mapped from fileName usually or name
    fileName: string;
    url: string;
    type: string;
  }[];
  isLiked?: boolean; // Optimistic UI
}

export type Post = IPost; // Alias for backward compatibility
export type PostAttachment = NonNullable<IPost['attachments']>[number];

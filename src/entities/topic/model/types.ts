export interface Topic {
  id: string;
  title: string;
  content?: string;
  categoryName?: string;
  topicVisibility?: 'PUBLIC' | 'PRIVATE';
  createdAt?: string;
  canManageTopic?: boolean;
  createdBy?: string;
}

export interface CurrentUserContext {
  isTopicManager: boolean;
  isTopicCreator: boolean;
  isTopicMember: boolean;
}

export interface TopicDetail {
  id: string;
  categoryName: string;
  title: string;
  content: string;
  createdAt: string;
  lastModifiedAt: string;
  topicVisibility: 'PUBLIC' | 'PRIVATE';
  isDeleted: boolean;
  createdBy: string;
  currentUserContext: CurrentUserContext;
}

export interface TopicMember {
  id: string;
  topicRole: 'MEMBER' | 'MODERATOR' | 'ADMIN';
  approved: boolean;
  joinedAt: string;
  userId: string;
  topicId: string;
  fullName: string;
  avatarUrl?: string;
  email: string;
}

export interface CreateTopicRequest {
  title: string;
  content: string;
  topicVisibility: 'PUBLIC' | 'PRIVATE';
}

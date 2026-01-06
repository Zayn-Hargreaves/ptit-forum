export interface ITopic {
  id: string;
  name: string;
  description?: string;
  avatar?: string;
  isPublic: boolean;
  memberCount?: number;
  postCount?: number;
  topicVisibility?: 'PUBLIC' | 'PRIVATE';
  currentUserContext?: {
    topicMember: boolean;  // Backend returns without 'is' prefix
    topicManager: boolean;
    topicCreator: boolean;
    requestStatus: 'NONE' | 'PENDING' | 'APPROVED';
  };
}

// Match backend ResourceType enum
export enum ResourceType {
  POST = 'POST',
  TOPIC = 'TOPIC',
  TOPIC_MEMBER = 'TOPIC_MEMBER',
  COMMENT = 'COMMENT',
  REPLY = 'REPLY',
  DOCUMENT = 'DOCUMENT',
  USER = 'USER',
  SYSTEM = 'SYSTEM',
  REACTION = 'REACTION',
}

// Match backend NotificationType enum
export enum NotificationType {
  POST_APPROVED = 'POST_APPROVED',
  POST_REJECTED = 'POST_REJECTED',
  DRIVE_UPLOAD = 'DRIVE_UPLOAD',
  DOCUMENT_APPROVED = 'DOCUMENT_APPROVED',
  DOCUMENT_REJECTED = 'DOCUMENT_REJECTED',
}

export enum NotificationStatus {
  SENT = 'SENT',
  READ = 'READ',
  DELETED = 'DELETED',
}

// Match backend UserNotificationResponse
export interface Notification {
  id: string;
  referenceId: string | null;
  resourceType: ResourceType;
  parentReferenceId: string | null;
  relatedId: string | null;
  title: string;
  content: string | null;
  senderId: string | null;
  senderName: string;
  senderAvatar?: string; // Optional, not from backend
  deliveredAt: string;
  readAt: string | null;
  notificationStatus: NotificationStatus;
  type?: NotificationType; // Added for type-specific routing
  // Computed property for convenience
  get isRead(): boolean;
}

// Match backend Page response structure
export interface NotificationResponse {
  content: Notification[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      sorted: boolean;
      unsorted: boolean;
      empty: boolean;
    };
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  totalElements: number;
  totalPages: number;
  last: boolean;
  size: number;
  number: number;
  sort: {
    sorted: boolean;
    unsorted: boolean;
    empty: boolean;
  };
  first: boolean;
  numberOfElements: number;
  empty: boolean;
}

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
    topicMember: boolean; // Backend returns without 'is' prefix
    topicManager: boolean;
    topicCreator: boolean;
    requestStatus: 'NONE' | 'PENDING' | 'APPROVED';
  };
  categoryName?: string;
  createdAt?: string;
}

export type Topic = ITopic;

export enum TopicVisibility {
    PUBLIC = "PUBLIC",
    PRIVATE = "PRIVATE",
    FACULTY = "FACULTY",
}

export const TOPIC_VISIBILITY_LABEL: Record<TopicVisibility, string> = {
    [TopicVisibility.PUBLIC]: "Công khai",
    [TopicVisibility.PRIVATE]: "Riêng tư",
    [TopicVisibility.FACULTY]: "Theo khoa",
};

// Tương ứng: TopicResponse
export interface TopicResponse {
    id: string;
    categoryName: string;
    title: string;
    content: string;
    createdAt: string;        // LocalDateTime -> ISO string
    lastModifiedAt: string;
    topicVisibility: TopicVisibility;
    isDeleted: boolean;
    createdBy: string;
}

export interface DetailedTopicResponse extends TopicResponse {
    // Nếu BE trả thêm field thì bổ sung ở đây
    // ví dụ:
    // comments: CommentResponse[];
    // attachments: TopicFileResponse[];
}

// Tương ứng: SearchTopicRequest
export interface TopicSearchParams {
    page?: number;
    size?: number;
    categoryId?: string;
    keyword?: string;
    visibility?: TopicVisibility;
    fromDate?: string; // LocalDate -> yyyy-MM-dd
    toDate?: string;
}
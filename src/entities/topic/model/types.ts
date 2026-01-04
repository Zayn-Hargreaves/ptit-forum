export interface Topic {
  id: string;
  title: string;
  content?: string;
  categoryName?: string;
  topicVisibility?: 'PUBLIC' | 'PRIVATE';
  createdAt?: string;
}

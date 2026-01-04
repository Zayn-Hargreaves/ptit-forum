export interface AnnouncementAttachment {
  id: string;
  name: string;
  type: string;
  size: string;
  url: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  category: string;
  author: string;
  authorAvatar?: string;
  date: string;
  isPinned: boolean;
  views: number;
  attachments?: AnnouncementAttachment[];
}

export const announcementKeys = {
  all: ['announcements'] as const,
  list: (params: { page: number; size: number }) =>
    [...announcementKeys.all, 'list', params] as const,
};

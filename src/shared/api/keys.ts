export const queryKeys = {
  announcements: (params: { page: number; size: number }) =>
    ["announcements", params] as const,
};

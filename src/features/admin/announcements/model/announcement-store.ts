// features/admin/announcements/model/announcement-store.ts

import { create } from 'zustand';

import { AnnouncementResponse } from '@/entities/announcement/model/types';

interface AnnouncementStore {
  selectedAnnouncement?: AnnouncementResponse;
  isOpenConfig: boolean; // Dùng cho modal Create/Edit
  isOpenRelease: boolean; // Dùng cho modal Release (nếu tách riêng)

  openCreate: () => void;
  openEdit: (announcement: AnnouncementResponse) => void;
  openRelease: (announcement: AnnouncementResponse) => void;
  close: () => void;
}

export const useAnnouncementStore = create<AnnouncementStore>((set) => ({
  selectedAnnouncement: undefined,
  isOpenConfig: false,
  isOpenRelease: false,

  openCreate: () =>
    set({
      isOpenConfig: true,
      selectedAnnouncement: undefined,
    }),

  openEdit: (announcement) =>
    set({
      isOpenConfig: true,
      selectedAnnouncement: announcement,
    }),

  openRelease: (announcement) =>
    set({
      isOpenRelease: true,
      selectedAnnouncement: announcement,
    }),

  close: () =>
    set({
      isOpenConfig: false,
      isOpenRelease: false,
      selectedAnnouncement: undefined,
    }),
}));

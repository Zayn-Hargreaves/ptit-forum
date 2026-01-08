// features/admin/semesters/model/semester-store.ts

import { create } from 'zustand';

interface SemesterStore {
  isOpenCreate: boolean;
  openCreate: () => void;
  close: () => void;
}

export const useSemesterStore = create<SemesterStore>((set) => ({
  isOpenCreate: false,

  openCreate: () => set({ isOpenCreate: true }),

  close: () => set({ isOpenCreate: false }),
}));

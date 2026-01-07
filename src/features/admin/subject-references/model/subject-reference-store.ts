import { create } from 'zustand';

interface SubjectReferenceStore {
  isOpenCreate: boolean;
  openCreate: () => void;
  close: () => void;
}

export const useSubjectReferenceStore = create<SubjectReferenceStore>((set) => ({
  isOpenCreate: false,
  openCreate: () => set({ isOpenCreate: true }),
  close: () => set({ isOpenCreate: false }),
}));

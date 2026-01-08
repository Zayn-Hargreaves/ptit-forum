import { create } from 'zustand';

import { SubjectResponse } from '@/entities/subject/model/types';

interface SubjectStore {
  selectedSubject?: SubjectResponse;
  isOpenConfig: boolean; // Dùng cho modal Create/Edit

  openCreate: () => void;
  openEdit: (subject: SubjectResponse) => void;
  close: () => void;
}

export const useSubjectStore = create<SubjectStore>((set) => ({
  selectedSubject: undefined,
  isOpenConfig: false,

  openCreate: () =>
    set({
      isOpenConfig: true,
      selectedSubject: undefined,
    }),

  openEdit: (subject) =>
    set({
      isOpenConfig: true,
      selectedSubject: subject,
    }),

  close: () =>
    set({
      isOpenConfig: false,
      selectedSubject: undefined,
    }),
}));

import { create } from 'zustand';

import type { Classroom } from '@/shared/api/classroom.service';

interface ClassroomStore {
  selectedClassroom?: Classroom;
  isOpen: boolean;
  openCreate: () => void;
  openEdit: (classroom: Classroom) => void;
  close: () => void;
}

export const useClassroomStore = create<ClassroomStore>((set) => ({
  selectedClassroom: undefined,
  isOpen: false,
  openCreate: () => set({ isOpen: true, selectedClassroom: undefined }),
  openEdit: (classroom) => set({ isOpen: true, selectedClassroom: classroom }),
  close: () => set({ isOpen: false, selectedClassroom: undefined }),
}));

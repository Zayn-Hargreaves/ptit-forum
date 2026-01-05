import { create } from 'zustand';
import type { Faculty } from '@/shared/api/faculty.service';

interface FacultyStore {
    selectedFaculty?: Faculty;
    isOpen: boolean;
    openCreate: () => void;
    openEdit: (faculty: Faculty) => void;
    close: () => void;
}

export const useFacultyStore = create<FacultyStore>((set) => ({
    selectedFaculty: undefined,
    isOpen: false,
    openCreate: () => set({ isOpen: true, selectedFaculty: undefined }),
    openEdit: (faculty) => set({ isOpen: true, selectedFaculty: faculty }),
    close: () => set({ isOpen: false, selectedFaculty: undefined }),
}));

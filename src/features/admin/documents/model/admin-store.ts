import { create } from 'zustand';

import type { Document } from '@/entities/document/model/schema';

// Define the store state and actions
interface AdminDocumentStore {
  selectedDocument: Document | null;
  isOpen: boolean;

  // Actions
  setSelectedDocument: (doc: Document | null) => void;
  setIsOpen: (isOpen: boolean) => void;
  openReview: (doc: Document) => void;
  closeReview: () => void;
}

export const useAdminDocumentStore = create<AdminDocumentStore>((set) => ({
  selectedDocument: null,
  isOpen: false,

  setSelectedDocument: (doc) => set({ selectedDocument: doc }),
  setIsOpen: (isOpen) => set({ isOpen }),

  // Helper to open review in one call
  openReview: (doc) => set({ selectedDocument: doc, isOpen: true }),

  // Helper to close and cleanup
  closeReview: () => set({ isOpen: false, selectedDocument: null }),
}));

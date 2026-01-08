// features/admin/categories/model/category-store.ts

import { create } from 'zustand';
import { CategoryResponse } from '@/entities/category/model/types';

interface CategoryStore {
    selectedCategory?: CategoryResponse;
    isOpenConfig: boolean; // Dùng cho modal Create/Edit

    openCreate: () => void;
    openEdit: (category: CategoryResponse) => void;
    close: () => void;
}

export const useCategoryStore = create<CategoryStore>((set) => ({
    selectedCategory: undefined,
    isOpenConfig: false,

    openCreate: () => set({
        isOpenConfig: true,
        selectedCategory: undefined
    }),

    openEdit: (category) => set({
        isOpenConfig: true,
        selectedCategory: category
    }),

    close: () => set({
        isOpenConfig: false,
        selectedCategory: undefined
    }),
}));
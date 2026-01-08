"use client";

import { useQuery } from "@tanstack/react-query";
import {
    CategoryDataTable,
    columns,
    CategoryFormSheet
} from "@/features/admin/categories"; // Import từ index.ts của feature category
import { useCategoryStore } from "@/features/admin/categories/model/category-store";
import { categoryApi } from "@/shared/api/category.service";

export default function AdminCategoriesPage() {
    // 1. Lấy action mở form tạo mới từ store
    const { openCreate } = useCategoryStore();

    /* ---------------- Query Data ---------------- */
    // Vì Category ít dữ liệu hơn Announcement, ta fetch toàn bộ (Client-side pagination)
    // Không cần truyền params page/size vào queryFn
    const { data, isLoading } = useQuery({
        queryKey: ["admin-categories"],
        queryFn: () => categoryApi.getAll(),
    });

    // API trả về mảng CategoryResponse[] trực tiếp
    const categories = data || [];

    return (
        <div className="space-y-6">
            {/* Header Section */}
            <div>
                <h2 className="text-2xl font-bold tracking-tight">
                    Quản lý danh mục
                </h2>
                <p className="text-muted-foreground">
                    Quản lý các loại danh mục dùng cho bài viết và thông báo.
                </p>
            </div>

            {/* Data Table */}
            {/* Lưu ý: Khác với Announcement, Search và Filter của Category
                được xử lý nội bộ trong <CategoryDataTable /> (Client-side)
                nên ta không cần truyền props search/filter từ Page vào.
            */}
            <CategoryDataTable
                columns={columns}
                data={categories}
                loading={isLoading}
                onCreate={openCreate} // Nút "+ Tạo danh mục"
            />

            {/* Các Modal/Sheet xử lý hành động */}
            <CategoryFormSheet /> {/* Form Create/Edit */}

            {/* Category không có ReleaseDialog */}
        </div>
    );
}
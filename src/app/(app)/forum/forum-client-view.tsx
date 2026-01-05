'use client';

import { Category } from '@entities/category/api/category-api';
import { CategoryList } from '@entities/category/ui/category-list';
import { ForumSidebar } from '@shared/components/forum/forum-sidebar';

interface ForumClientViewProps {
    initialCategories: Category[];
}

export function ForumClientView({ initialCategories }: Readonly<ForumClientViewProps>) {
    return (
        <div className="container mx-auto py-8 px-4 space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Diễn đàn</h1>
                    <p className="text-muted-foreground mt-1">Chọn chủ đề bạn quan tâm</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <div className="lg:col-span-3">
                   <div className="mb-6">
                      <h2 className="text-2xl font-semibold mb-4">Danh mục</h2>
                      <CategoryList categories={initialCategories} />
                   </div>
                </div>
                
                <div className="hidden lg:block lg:col-span-1">
                    <ForumSidebar />
                </div>
            </div>
        </div>
    );
}

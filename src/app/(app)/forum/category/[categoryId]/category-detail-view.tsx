'use client';

import { Topic } from '@entities/topic/model/types';
import { TopicCard } from '@entities/topic/ui/topic-card';
import { Button } from '@shared/ui/button/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Category } from '@entities/category/api/category-api';

import { CreateTopicDialog } from '@/features/topic/create-topic/ui/create-topic-dialog';

interface CategoryDetailViewProps {
  topics: Topic[];
  category: Category;
}

export function CategoryDetailView({ topics, category }: Readonly<CategoryDetailViewProps>) {
  return (
    <div className="container mx-auto py-8 px-4 space-y-8">
      <div className="flex items-center justify-between border-b pb-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/forum">
              <ArrowLeft className="w-5 h-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{category.name}</h1>
            <p className="text-muted-foreground mt-1">{category.description ?? 'Danh sách các chủ đề thảo luận'}</p>
          </div>
        </div>
        <CreateTopicDialog categoryId={category.id} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {topics.length > 0 ? (
          topics.map((topic) => (
            <TopicCard key={topic.id} topic={topic} />
          ))
        ) : (
          <div className="col-span-full py-12 text-center text-muted-foreground border-2 border-dashed rounded-lg">
            Chưa có chủ đề nào trong danh mục này.
          </div>
        )}
      </div>
    </div>
  );
}

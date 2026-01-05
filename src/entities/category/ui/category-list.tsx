'use client';

import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from '@shared/ui/card/card';
import { Category } from '@entities/category/api/category-api';

interface CategoryListProps {
  categories: Category[];
}

export function CategoryList({ categories }: CategoryListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {categories.map((category) => (
        <Link key={category.id} href={`/forum/category/${category.id}`}>
          <Card className="h-full hover:shadow-md transition-shadow cursor-pointer border-l-4 border-l-primary">
            <CardHeader>
              <CardTitle className="text-xl flex items-center justify-between">
                {category.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm line-clamp-3">
                {category.description || 'Chưa có mô tả'}
              </p>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}

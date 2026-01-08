'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@shared/ui/card/card';
import Link from 'next/link';

import { ICategory } from '../model/types';

interface CategoryListProps {
  categories: ICategory[];
}

export function CategoryGrid({ categories }: CategoryListProps) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {categories.map((category) => (
        <Link key={category.id} href={`/forum/category/${category.id}`}>
          <Card className="border-l-primary h-full cursor-pointer border-l-4 transition-shadow hover:shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-xl">
                {category.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground line-clamp-3 text-sm">
                {category.description || 'Chưa có mô tả'}
              </p>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}

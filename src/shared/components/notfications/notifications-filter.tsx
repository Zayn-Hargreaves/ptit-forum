'use client';

import { Badge } from '@shared/ui/badge/badge';
import { Button } from '@shared/ui/button/button';
import { Card, CardContent, CardHeader, CardTitle } from '@shared/ui/card/card';
import { CheckCheck } from 'lucide-react';

const filterCategories = [
  { label: 'Tất cả', count: 24, value: 'all' },
  { label: 'Chưa đọc', count: 8, value: 'unread' },
  { label: 'Bài viết', count: 12, value: 'posts' },
  { label: 'Bình luận', count: 6, value: 'comments' },
  { label: 'Tài liệu', count: 3, value: 'documents' },
  { label: 'Sự kiện', count: 3, value: 'events' },
];

export function NotificationsFilter() {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Bộ lọc</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {filterCategories.map((category) => (
            <Button key={category.value} variant="ghost" className="w-full justify-between">
              <span>{category.label}</span>
              <Badge variant="secondary">{category.count}</Badge>
            </Button>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <Button className="w-full bg-transparent" variant="outline">
            <CheckCheck className="mr-2 h-4 w-4" />
            Đánh dấu tất cả đã đọc
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

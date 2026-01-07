'use client';

import { fetchAnnouncements } from '@entities/announcement/api';
import { announcementKeys } from '@entities/announcement/lib/query-keys';
import { AnnouncementType } from '@entities/announcement/model/types';
import { Badge } from '@shared/ui/badge/badge';
import { Button } from '@shared/ui/button/button';
import { Card, CardContent } from '@shared/ui/card/card';
import { Pagination } from '@shared/ui/pagination/pagination';
import { Skeleton } from '@shared/ui/skeleton/skeleton';
import { useQuery } from '@tanstack/react-query';
import { Calendar, FileText } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

export function AnnouncementsList() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const page = Math.max(1, Number(searchParams.get('page')) || 1);
  const types = searchParams.getAll('type') as AnnouncementType[];
  const keyword = searchParams.get('keyword') || undefined;
  const size = 10;

  const queryParams = { page, size, type: types, keyword };

  const { data, isLoading, isError } = useQuery({
    queryKey: announcementKeys.list(queryParams),
    queryFn: () => fetchAnnouncements(queryParams),
    placeholderData: (previousData) => previousData,
  });

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', newPage.toString());
    router.push(`?${params.toString()}`, { scroll: true });
  };

  if (isLoading) return <AnnouncementsListSkeleton />;
  if (isError) return <div className="text-red-500">Có lỗi khi tải thông báo.</div>;
  if (!data || data.items.length === 0)
    return <div className="py-10 text-center">Không có thông báo nào.</div>;

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {data.items.map((announcement) => (
          <Card
            key={announcement.id}
            className={`hover:border-primary/50 transition-all hover:shadow-md`}
          >
            <CardContent className="p-6">
              <div className="flex gap-4">
                <div className="flex-1">
                  <div className="mb-3 flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="mb-2 flex items-center gap-2">
                        {/* Logic Pin chưa có từ API, tạm ẩn hoặc fake */}
                        {/* <Pin className="h-4 w-4 text-primary" /> */}
                        <Link href={`/announcements/${announcement.id}`}>
                          <h3 className="hover:text-primary text-lg leading-tight font-semibold">
                            {announcement.title}
                          </h3>
                        </Link>
                      </div>
                      <p className="text-muted-foreground mb-3 line-clamp-2 text-sm">
                        {announcement.excerpt}
                      </p>
                    </div>
                    <Badge variant="secondary">{announcement.category}</Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-muted-foreground flex items-center gap-4 text-sm">
                      <span>{announcement.author}</span>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(announcement.date).toLocaleDateString('vi-VN')}</span>
                      </div>
                    </div>

                    <Button variant="default" size="sm" asChild>
                      <Link href={`/announcements/${announcement.id}`}>
                        <FileText className="mr-2 h-4 w-4" />
                        Xem chi tiết
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {data.totalPages > 1 && (
        <div className="flex justify-center pt-4">
          <Pagination
            currentPage={page}
            totalPages={data.totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
}

function AnnouncementsListSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="space-y-3 rounded-lg border p-6">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <div className="flex justify-between pt-2">
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-8 w-24" />
          </div>
        </div>
      ))}
    </div>
  );
}

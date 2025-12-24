"use client";

import { useQuery } from "@tanstack/react-query";
import { useSearchParams, useRouter } from "next/navigation";
import { fetchAnnouncements } from "@entities/announcement/api";
import { announcementKeys } from "@entities/announcement/lib/query-keys";
import { AnnouncementType } from "@entities/announcement/model/types";
import { Pagination } from "@shared/ui/pagination/pagination";
import { Card, CardContent } from "@shared/ui/card/card";
import { Badge } from "@shared/ui/badge/badge";
import { Button } from "@shared/ui/button/button";
import { Calendar, FileText, Pin } from "lucide-react";
import Link from "next/link";
import { Skeleton } from "@shared/ui/skeleton/skeleton";

export function AnnouncementsList() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const page = Number(searchParams.get("page")) || 1;
  const types = searchParams.getAll("type") as AnnouncementType[];
  const keyword = searchParams.get("keyword") || undefined;
  const size = 10;

  const queryParams = { page, size, type: types, keyword };

  const { data, isLoading, isError } = useQuery({
    queryKey: announcementKeys.list(queryParams),
    queryFn: () => fetchAnnouncements(queryParams),
    placeholderData: (previousData) => previousData,
  });

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    router.push(`?${params.toString()}`, { scroll: true });
  };

  if (isLoading) return <AnnouncementsListSkeleton />;
  if (isError)
    return <div className="text-red-500">Có lỗi khi tải thông báo.</div>;
  if (!data || data.items.length === 0)
    return <div className="text-center py-10">Không có thông báo nào.</div>;

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {data.items.map((announcement) => (
          <Card
            key={announcement.id}
            className={`transition-all hover:border-primary/50 hover:shadow-md`}
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
                          <h3 className="text-lg font-semibold leading-tight hover:text-primary">
                            {announcement.title}
                          </h3>
                        </Link>
                      </div>
                      <p className="mb-3 text-sm text-muted-foreground line-clamp-2">
                        {announcement.excerpt}
                      </p>
                    </div>
                    <Badge variant="secondary">{announcement.category}</Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{announcement.author}</span>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {new Date(announcement.date).toLocaleDateString(
                            "vi-VN"
                          )}
                        </span>
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
        <div key={i} className="border rounded-lg p-6 space-y-3">
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

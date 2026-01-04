"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchAnnouncements } from "@entities/announcement/api";
import { announcementKeys } from "@entities/announcement/lib/query-keys";

export default function AnnouncementsListClient({
  initialParams,
}: {
  initialParams: { page: number; size: number };
}) {
  const { data, isLoading, isError } = useQuery({
    queryKey: announcementKeys.list(initialParams),
    queryFn: () => fetchAnnouncements(initialParams),
  });

  if (isLoading) return <div>Loading...</div>;
  if (isError || !data) return <div>Không tải được thông báo</div>;

  return (
    <div className="space-y-4">
      {data.items.map((a) => (
        <div key={a.id} className="border rounded p-4">
          <div className="font-semibold">{a.title}</div>
          {a.excerpt && (
            <div className="text-sm text-muted-foreground">{a.excerpt}</div>
          )}
        </div>
      ))}
    </div>
  );
}

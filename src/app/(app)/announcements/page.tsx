import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@shared/lib/query/get-query-client";
import { fetchAnnouncements } from "@entities/announcement/api";
import AnnouncementsListClient from "@shared/components/announcements/announcements-list-client";
import { announcementKeys } from "@entities/announcement/lib/query-keys";

export default async function AnnouncementsPage() {
  const queryClient = getQueryClient();
  const params = { page: 0, size: 10 };

  await queryClient.prefetchQuery({
    queryKey: announcementKeys.list(params),
    queryFn: () => fetchAnnouncements(params),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <AnnouncementsListClient initialParams={params} />
    </HydrationBoundary>
  );
}

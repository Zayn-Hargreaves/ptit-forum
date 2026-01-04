import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { getQueryClient } from '@shared/lib/query/get-query-client';
import { fetchAnnouncements } from '@entities/announcement/api';
import { announcementKeys } from '@entities/announcement/lib/query-keys';
import { AnnouncementsList } from '@widgets/announcement-list/ui/announcement-list';
import { AnnouncementsFilter } from '@features/announcements/annoucements-filter';
import { AnnouncementType } from '@entities/announcement/model/types';
import { cookies } from 'next/headers';

type PageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function AnnouncementsPage(props: PageProps) {
  const searchParams = await props.searchParams;
  const queryClient = getQueryClient();
  const cookieStore = await cookies();

  const page = Number(searchParams.page) || 1;
  const typeParam = searchParams.type;

  let types: AnnouncementType[] | undefined = undefined;
  if (typeof typeParam === 'string') {
    if (Object.values(AnnouncementType).includes(typeParam as AnnouncementType)) {
      types = [typeParam as AnnouncementType];
    }
  } else if (Array.isArray(typeParam)) {
    types = typeParam.filter((t) =>
      Object.values(AnnouncementType).includes(t as AnnouncementType)
    ) as AnnouncementType[];
  }

  const fetchParams = {
    page,
    size: 10,
    type: types,
    keyword: typeof searchParams.keyword === 'string' ? searchParams.keyword : undefined,
  };

  const accessToken = cookieStore.get('accessToken');
  const headers: Record<string, string> = {};
  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken.value}`;
  }

  await queryClient.prefetchQuery({
    queryKey: announcementKeys.list(fetchParams),
    queryFn: () =>
      fetchAnnouncements(fetchParams, {
        headers,
      }),
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold">Thông báo</h1>
        <p className="text-muted-foreground">Cập nhật thông tin học vụ, học bổng và hoạt động của trường</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        <div className="lg:col-span-1">
          <AnnouncementsFilter />
        </div>

        <div className="lg:col-span-3">
          <HydrationBoundary state={dehydrate(queryClient)}>
            <AnnouncementsList />
          </HydrationBoundary>
        </div>
      </div>
    </div>
  );
}

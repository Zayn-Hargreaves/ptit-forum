import { getAnnouncementById } from '@entities/announcement/api';
import { AnnouncementDetail } from '@entities/announcement/ui/announcement-detail';
import { RelatedAnnouncements } from '@shared/components/announcements/related-annoucement';
import { Metadata } from 'next';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import { cache } from 'react';

type PageProps = {
  params: Promise<{ id: string }>;
};

const getCachedAnnouncement = cache(async (id: string) => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken');

  const headers: Record<string, string> = {};
  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken.value}`;
  }

  return getAnnouncementById(id, {
    headers,
  });
});

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const params = await props.params;

  try {
    const data = await getCachedAnnouncement(params.id);

    return {
      title: `${data.title} | PTIT Forum`,
      description: data.content?.slice(0, 160) || '',
    };
  } catch (error) {
    if (error instanceof Error && error.message === 'NOT_FOUND') {
      return { title: 'Thông báo không tồn tại' };
      // notFound();
    }
    throw error;
  }
}

export default async function AnnouncementDetailPage(props: PageProps) {
  const params = await props.params;

  try {
    const announcement = await getCachedAnnouncement(params.id);

    return (
      <div className="container mx-auto max-w-6xl px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <AnnouncementDetail data={announcement} />
          </div>

          <div className="space-y-6 lg:col-span-4">
            <RelatedAnnouncements currentId={announcement.id} type={announcement.type} />
          </div>
        </div>
      </div>
    );
  } catch (error) {
    if (error instanceof Error && error.message === 'NOT_FOUND') {
      notFound();
    }
    throw error;
  }
}

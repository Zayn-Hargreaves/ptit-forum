import { cache } from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { getAnnouncementById } from "@entities/announcement/api";
import { AnnouncementDetail } from "@entities/announcement/ui/announcement-detail";
import { RelatedAnnouncements } from "@shared/components/announcements/related-annoucement";

type PageProps = {
  params: Promise<{ id: string }>;
};

const getCachedAnnouncement = cache(async (id: string) => {
  const cookieStore = await cookies();
  return getAnnouncementById(id, {
    headers: { Cookie: cookieStore.toString() },
  });
});

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const params = await props.params;

  try {
    const data = await getCachedAnnouncement(params.id);

    return {
      title: `${data.title} | PTIT Forum`,
      description: data.content?.slice(0, 160) || "",
    };
  } catch (error) {
    if (error instanceof Error && error.message === "NOT_FOUND") {
      return { title: "Thông báo không tồn tại" };
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
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <AnnouncementDetail data={announcement} />
          </div>

          <div className="lg:col-span-4 space-y-6">
            <RelatedAnnouncements
              currentId={announcement.id}
              type={announcement.type}
            />
          </div>
        </div>
      </div>
    );
  } catch (error) {
    if (error instanceof Error && error.message === "NOT_FOUND") {
      notFound();
    }
    throw error;
  }
}

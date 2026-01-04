import { z } from "zod";
import { getBaseUrl } from "@shared/lib/base-url";

const AnnouncementSchema = z.object({
  id: z.string(),
  title: z.string(),
  excerpt: z.string().optional(),
  date: z.string().optional(),
});

const AnnouncementListSchema = z.object({
  items: z.array(AnnouncementSchema),
  page: z.number(),
  size: z.number(),
  total: z.number(),
});

export type AnnouncementListResponse = z.infer<typeof AnnouncementListSchema>;

export async function fetchAnnouncements(params: {
  page: number;
  size: number;
}) {
  const qs = new URLSearchParams({
    page: String(params.page),
    size: String(params.size),
  });

  const baseUrl = getBaseUrl();
  const url = `${baseUrl}/api/announcements?${qs}`;

  const res = await fetch(url, { cache: "no-store" });

  if (!res.ok) {
    const errText = await res.text().catch(() => "");
    throw new Error(`Failed to fetch announcements: ${res.status} ${errText}`);
  }

  const json = await res.json();
  return AnnouncementListSchema.parse(json);
}

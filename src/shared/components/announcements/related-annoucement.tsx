import { fetchAnnouncements } from "@entities/announcement/api";
import { AnnouncementType } from "@entities/announcement/model/types";
import { Card, CardContent, CardHeader, CardTitle } from "@shared/ui/card/card";
import { Badge } from "@shared/ui/badge/badge";
import Link from "next/link";
import { Calendar } from "lucide-react";
import { cookies } from "next/headers"; // Import cookies

interface Props {
  currentId: string;
  type: AnnouncementType;
}

export async function RelatedAnnouncements({
  currentId,
  type,
}: Readonly<Props>) {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken");

    const headers: Record<string, string> = {};
    if (accessToken) {
      headers["Authorization"] = `Bearer ${accessToken.value}`;
    }

    const data = await fetchAnnouncements(
      {
        page: 1,
        size: 5,
        type: [type],
      },
      {
        headers,
      }
    );

    const relatedItems = data.items
      .filter((item) => item.id !== currentId)
      .slice(0, 4);

    if (relatedItems.length === 0) return null;

    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Thông báo liên quan</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {relatedItems.map((item) => (
              <Link
                key={item.id}
                href={`/announcements/${item.id}`}
                className="block group"
              >
                <div className="rounded-lg border p-3 transition-all hover:bg-muted/50 group-hover:border-primary/50">
                  <Badge variant="secondary" className="mb-2 text-xs">
                    {item.category}
                  </Badge>
                  <h4 className="mb-2 text-sm font-semibold leading-tight line-clamp-2 group-hover:text-primary">
                    {item.title}
                  </h4>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Calendar className="mr-1 h-3 w-3" />
                    {new Date(item.date).toLocaleDateString("vi-VN")}
                  </div>
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>
    );
  } catch (error) {
    console.error("Failed to load related announcements:", error);
    return null;
  }
}

import { fetchAnnouncements } from '@entities/announcement/api';
import { AnnouncementType } from '@entities/announcement/model/types';
import { Badge } from '@shared/ui/badge/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@shared/ui/card/card';
import { Calendar } from 'lucide-react';
import { cookies } from 'next/headers'; // Import cookies
import Link from 'next/link';

interface Props {
  currentId: string;
  type: AnnouncementType;
}

export async function RelatedAnnouncements({ currentId, type }: Readonly<Props>) {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken');

    const headers: Record<string, string> = {};
    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken.value}`;
    }

    const data = await fetchAnnouncements(
      {
        page: 1,
        size: 5,
        type: [type],
      },
      {
        headers,
      },
    );

    const relatedItems = data.items.filter((item) => item.id !== currentId).slice(0, 4);

    if (relatedItems.length === 0) return null;

    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Thông báo liên quan</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {relatedItems.map((item) => (
              <Link key={item.id} href={`/announcements/${item.id}`} className="group block">
                <div className="hover:bg-muted/50 group-hover:border-primary/50 rounded-lg border p-3 transition-all">
                  <Badge variant="secondary" className="mb-2 text-xs">
                    {item.category}
                  </Badge>
                  <h4 className="group-hover:text-primary mb-2 line-clamp-2 text-sm leading-tight font-semibold">
                    {item.title}
                  </h4>
                  <div className="text-muted-foreground flex items-center text-xs">
                    <Calendar className="mr-1 h-3 w-3" />
                    {new Date(item.date).toLocaleDateString('vi-VN')}
                  </div>
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>
    );
  } catch (error) {
    console.error('Failed to load related announcements:', error);
    return null;
  }
}

import { Badge } from "@shared/ui/badge/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@shared/ui/card/card";
import { Calendar, Eye } from "lucide-react";
import Link from "next/link";

const relatedAnnouncements = [
  {
    id: 3,
    title: "Thông báo tuyển dụng thực tập sinh tại FPT Software",
    category: "Tuyển dụng",
    date: "2024-11-05",
    views: 567,
  },
  {
    id: 4,
    title: "Kế hoạch tổ chức Ngày hội việc làm PTIT 2024",
    category: "CLB & Hoạt động",
    date: "2024-11-03",
    views: 445,
  },
  {
    id: 5,
    title: "Hướng dẫn đăng ký học phần học kỳ 2 năm học 2024-2025",
    category: "Học vụ",
    date: "2024-11-01",
    views: 1567,
  },
];

export function RelatedAnnouncements({ currentId }: { currentId: string }) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Thông báo liên quan</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {relatedAnnouncements.map((announcement) => (
            <Link
              key={announcement.id}
              href={`/announcements/${announcement.id}`}
              className="block rounded-lg border p-4 transition-all hover:border-primary/50 hover:bg-muted/50"
            >
              <Badge variant="secondary" className="mb-2">
                {announcement.category}
              </Badge>
              <h4 className="mb-3 line-clamp-2 font-semibold leading-tight">
                {announcement.title}
              </h4>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>
                    {new Date(announcement.date).toLocaleDateString("vi-VN")}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Eye className="h-3 w-3" />
                  <span>{announcement.views}</span>
                </div>
              </div>
            </Link>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Danh mục thông báo</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {["Học vụ", "Học bổng", "Tuyển dụng", "CLB & Hoạt động", "Khác"].map(
            (category) => (
              <Link
                key={category}
                href={`/announcements?category=${category}`}
                className="flex items-center justify-between rounded-lg p-3 transition-colors hover:bg-muted"
              >
                <span className="font-medium">{category}</span>
                <Badge variant="outline">12</Badge>
              </Link>
            )
          )}
        </CardContent>
      </Card>
    </div>
  );
}

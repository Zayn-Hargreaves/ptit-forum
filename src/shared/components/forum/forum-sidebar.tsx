import { Badge } from "@shared/ui/badge/badge";
import { Button } from "@shared/ui/button/button";
import { Card, CardContent, CardHeader, CardTitle } from "@shared/ui/card/card";
import { PlusCircle, TrendingUp, Award } from "lucide-react";
import Link from "next/link";

const popularTags = [
  { name: "lập-trình", count: 234 },
  { name: "học-vụ", count: 189 },
  { name: "thực-tập", count: 156 },
  { name: "đề-thi", count: 145 },
  { name: "học-bổng", count: 123 },
  { name: "javascript", count: 98 },
  { name: "python", count: 87 },
  { name: "database", count: 76 },
];

export function ForumSidebar() {
  return (
    <div className="space-y-6">
      {/* Create Post Button */}
      <Card className="border-2 border-primary/20 bg-linear-to-br from-primary/5 to-accent/5">
        <CardContent className="p-6">
          <h3 className="mb-2 font-semibold">Có câu hỏi hoặc chia sẻ?</h3>
          <p className="mb-4 text-sm text-muted-foreground">
            Tạo bài viết mới để thảo luận với cộng đồng
          </p>
          <Button className="w-full" asChild>
            <Link href="/forum/create">
              <PlusCircle className="mr-2 h-4 w-4" />
              Tạo bài viết
            </Link>
          </Button>
        </CardContent>
      </Card>

      {/* Popular Tags */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <TrendingUp className="h-5 w-5 text-primary" />
            Tag phổ biến
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {popularTags.map((tag) => (
              <Link key={tag.name} href={`/forum/tag/${tag.name}`}>
                <Badge
                  variant="secondary"
                  className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                >
                  {tag.name} ({tag.count})
                </Badge>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Forum Rules */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Award className="h-5 w-5 text-primary" />
            Quy định diễn đàn
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>• Tôn trọng và lịch sự với mọi người</p>
          <p>• Không spam hoặc quảng cáo</p>
          <p>• Đăng đúng box và sử dụng tag phù hợp</p>
          <p>• Không chia sẻ thông tin cá nhân</p>
          <Link
            href="/rules"
            className="mt-2 inline-block text-primary hover:underline"
          >
            Xem đầy đủ quy định →
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}

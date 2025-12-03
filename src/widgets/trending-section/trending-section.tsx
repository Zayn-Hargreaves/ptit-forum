import { Avatar, AvatarFallback } from "@shared/ui/avatar/avatar";
import { Badge } from "@shared/ui/badge/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@shared/ui/card/card";
import { MessageSquare, Eye, TrendingUp, FileText } from "lucide-react";
import Link from "next/link";

const trendingPosts = [
  {
    id: 1,
    title: "Hướng dẫn đăng ký học phần kỳ 1/2024",
    author: "Nguyễn Văn A",
    box: "Học vụ",
    comments: 45,
    views: 1200,
  },
  {
    id: 2,
    title: "Chia sẻ kinh nghiệm phỏng vấn thực tập FPT",
    author: "Trần Thị B",
    box: "Nghề nghiệp",
    comments: 32,
    views: 890,
  },
  {
    id: 3,
    title: "Tài liệu ôn thi Cấu trúc dữ liệu và giải thuật",
    author: "Lê Văn C",
    box: "Học tập",
    comments: 28,
    views: 756,
  },
];

const recentDocuments = [
  {
    id: 1,
    title: "Slide bài giảng Lập trình hướng đối tượng",
    subject: "OOP",
    downloads: 234,
  },
  {
    id: 2,
    title: "Đề thi giữa kỳ Cơ sở dữ liệu",
    subject: "Database",
    downloads: 189,
  },
  {
    id: 3,
    title: "Bài tập thực hành Mạng máy tính",
    subject: "Network",
    downloads: 156,
  },
];

const topContributors = [
  { name: "Nguyễn Văn A", reputation: 2450, posts: 156 },
  { name: "Trần Thị B", reputation: 1890, posts: 134 },
  { name: "Lê Văn C", reputation: 1567, posts: 98 },
];

export function TrendingSection() {
  return (
    <section className="bg-muted/30 py-20">
      <div className="container mx-auto px-4">
        <div className="mb-12 flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Đang thịnh hành</h2>
          <Link
            href="/forum"
            className="text-sm font-medium text-primary hover:underline"
          >
            Xem tất cả
          </Link>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Trending Posts */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Bài viết nổi bật
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {trendingPosts.map((post) => (
                <Link
                  key={post.id}
                  href={`/forum/post/${post.id}`}
                  className="block rounded-lg border p-4 transition-all hover:border-primary/50 hover:shadow-md"
                >
                  <div className="mb-2 flex items-start justify-between gap-4">
                    <h3 className="font-semibold leading-tight hover:text-primary">
                      {post.title}
                    </h3>
                    <Badge variant="secondary">{post.box}</Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Avatar className="h-5 w-5">
                        <AvatarFallback className="text-xs">
                          {post.author[0]}
                        </AvatarFallback>
                      </Avatar>
                      <span>{post.author}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageSquare className="h-4 w-4" />
                      <span>{post.comments}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      <span>{post.views}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </CardContent>
          </Card>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recent Documents */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <FileText className="h-5 w-5 text-primary" />
                  Tài liệu mới
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {recentDocuments.map((doc) => (
                  <Link
                    key={doc.id}
                    href={`/documents/${doc.id}`}
                    className="block rounded-lg border p-3 transition-all hover:border-primary/50"
                  >
                    <h4 className="mb-1 text-sm font-medium leading-tight hover:text-primary">
                      {doc.title}
                    </h4>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <Badge variant="outline" className="text-xs">
                        {doc.subject}
                      </Badge>
                      <span>{doc.downloads} lượt tải</span>
                    </div>
                  </Link>
                ))}
              </CardContent>
            </Card>

            {/* Top Contributors */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Sinh viên năng động</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {topContributors.map((user, index) => (
                  <div
                    key={user.name}
                    className="flex items-center gap-3 rounded-lg border p-3"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium">{user.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {user.reputation} điểm • {user.posts} bài viết
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}

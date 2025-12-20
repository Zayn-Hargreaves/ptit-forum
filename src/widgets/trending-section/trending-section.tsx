import Link from "next/link";
import { MessageSquare, Eye, TrendingUp, FileText } from "lucide-react";

import { fetchTrendingPosts } from "@entities/post/api/fetch-trending";
import type { TrendingPost } from "@entities/post/model/types";
// Nếu em chưa có fetchRecentDocuments / fetchTopContributors thì tạm để mock riêng ở sidebar,
// hoặc ẩn 2 card đó. Anh để TODO để em triển tiếp.

import { Avatar, AvatarFallback } from "@shared/ui/avatar/avatar";
import { Badge } from "@shared/ui/badge/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@shared/ui/card/card";

export async function TrendingSection() {
  let posts: TrendingPost[] = [];

  try {
    posts = await fetchTrendingPosts();
  } catch {
    // ✅ Fail silently để landing không “chết”
    return null;
  }

  if (!posts || posts.length === 0) return null;

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
          {/* ✅ Trending Posts */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Bài viết nổi bật
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              {posts.map((post) => {
                const authorName = post.author?.name?.trim() || "Ẩn danh";
                const authorFallback = (authorName[0] || "U").toUpperCase();

                // ✅ Link chuẩn theo routing của em:
                // hiện em có /forum/[boxSlug] + modal create-post,
                // còn chi tiết post đang dùng /forum/post/:id ở mock cũ.
                // Nếu route thật là khác (vd /forum/posts/:id), đổi ở đây 1 chỗ.
                const href = `/forum/post/${post.id}`;

                return (
                  <Link
                    key={post.id}
                    href={href}
                    className="block rounded-lg border p-4 transition-all hover:border-primary/50 hover:shadow-md"
                  >
                    <div className="mb-2 flex items-start justify-between gap-4">
                      <h3 className="font-semibold leading-tight hover:text-primary">
                        {post.title}
                      </h3>
                      <Badge variant="secondary">{post.category}</Badge>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-5 w-5">
                          <AvatarFallback className="text-xs">
                            {authorFallback}
                          </AvatarFallback>
                        </Avatar>
                        <span className="line-clamp-1">{authorName}</span>
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
                );
              })}
            </CardContent>
          </Card>

          {/* ✅ Sidebar (tạm giữ layout, nhưng không mock data bừa bãi) */}
          <div className="space-y-6">
            {/* Recent Documents */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <FileText className="h-5 w-5 text-primary" />
                  Tài liệu mới
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                {/* TODO: thay bằng fetchRecentDocuments() */}
                <div className="rounded-lg border p-3">
                  Chưa kết nối dữ liệu tài liệu. (TODO)
                </div>
              </CardContent>
            </Card>

            {/* Top Contributors */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Sinh viên năng động</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                {/* TODO: thay bằng fetchTopContributors() */}
                <div className="rounded-lg border p-3">
                  Chưa kết nối dữ liệu leaderboard. (TODO)
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}

import { Avatar, AvatarFallback } from "@shared/ui/avatar/avatar";
import { Badge } from "@shared/ui/badge/badge";
import { Card, CardContent } from "@shared/ui/card/card";
import { MessageSquare, Eye, ThumbsUp, Pin } from "lucide-react";
import Link from "next/link";

const posts = [
  {
    id: 1,
    title: "Làm thế nào để tối ưu hóa thuật toán sắp xếp?",
    author: "Nguyễn Văn A",
    authorLevel: 3,
    createdAt: "2 giờ trước",
    tags: ["thuật-toán", "sắp-xếp", "tối-ưu"],
    comments: 12,
    views: 234,
    likes: 8,
    isPinned: false,
    hasAnswer: true,
  },
  {
    id: 2,
    title: "[THÔNG BÁO] Hướng dẫn đăng ký học phần kỳ 1/2024",
    author: "Admin",
    authorLevel: 10,
    createdAt: "5 giờ trước",
    tags: ["học-vụ", "đăng-ký"],
    comments: 45,
    views: 1200,
    likes: 23,
    isPinned: true,
    hasAnswer: false,
  },
  {
    id: 3,
    title: "Chia sẻ code giải bài tập Dynamic Programming",
    author: "Trần Thị B",
    authorLevel: 5,
    createdAt: "1 ngày trước",
    tags: ["lập-trình", "dynamic-programming"],
    comments: 8,
    views: 456,
    likes: 15,
    isPinned: false,
    hasAnswer: true,
  },
  {
    id: 4,
    title: "Có ai biết cách debug lỗi này không?",
    author: "Lê Văn C",
    authorLevel: 2,
    createdAt: "2 ngày trước",
    tags: ["debug", "javascript"],
    comments: 3,
    views: 123,
    likes: 2,
    isPinned: false,
    hasAnswer: false,
  },
];

export function PostList({ boxId }: { boxId: string }) {
  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <Link key={post.id} href={`/forum/post/${post.id}`}>
          <Card className="transition-all hover:border-primary/50 hover:shadow-md">
            <CardContent className="p-6">
              <div className="flex gap-4">
                {/* Author Avatar */}
                <Avatar className="h-10 w-10">
                  <AvatarFallback>{post.author[0]}</AvatarFallback>
                </Avatar>

                {/* Post Content */}
                <div className="flex-1">
                  <div className="mb-2 flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="mb-1 flex items-center gap-2">
                        {post.isPinned && (
                          <Pin className="h-4 w-4 text-primary" />
                        )}
                        <h3 className="text-lg font-semibold hover:text-primary">
                          {post.title}
                        </h3>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span className="font-medium">{post.author}</span>
                        <Badge variant="secondary" className="text-xs">
                          Level {post.authorLevel}
                        </Badge>
                        <span>•</span>
                        <span>{post.createdAt}</span>
                      </div>
                    </div>
                    {post.hasAnswer && (
                      <Badge variant="default" className="bg-green-500">
                        Đã trả lời
                      </Badge>
                    )}
                  </div>

                  {/* Tags */}
                  <div className="mb-3 flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <ThumbsUp className="h-4 w-4" />
                      <span>{post.likes}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageSquare className="h-4 w-4" />
                      <span>{post.comments} bình luận</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      <span>{post.views} lượt xem</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}

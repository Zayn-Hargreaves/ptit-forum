import { Avatar, AvatarFallback } from "@shared/ui/avatar/avatar";
import { Badge } from "@shared/ui/badge/badge";
import { Button } from "@shared/ui/button/button";
import { Card, CardContent } from "@shared/ui/card/card";
import {
  ThumbsUp,
  ThumbsDown,
  Bookmark,
  Share2,
  Flag,
  Eye,
} from "lucide-react";

export function PostDetail({ postId }: { postId: string }) {
  // postId is not user pls check it later pr
  // Mock data
  const post = {
    title: "Làm thế nào để tối ưu hóa thuật toán sắp xếp?",
    content: `
Chào mọi người,

Mình đang làm một bài tập về thuật toán sắp xếp và gặp vấn đề về hiệu suất. Mình đã implement Quick Sort nhưng với input lớn (> 100,000 phần tử) thì chạy rất chậm.

Các bạn có thể chia sẻ kinh nghiệm về cách tối ưu hóa thuật toán sắp xếp không? Mình nên dùng thuật toán nào cho trường hợp này?

Code của mình:

\`\`\`python
def quick_sort(arr):
    if len(arr) <= 1:
        return arr
    pivot = arr[len(arr) // 2]
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]
    return quick_sort(left) + middle + quick_sort(right)
\`\`\`

Cảm ơn mọi người!
    `,
    author: "Nguyễn Văn A",
    authorLevel: 3,
    authorReputation: 450,
    createdAt: "2 giờ trước",
    tags: ["thuật-toán", "sắp-xếp", "tối-ưu"],
    views: 234,
    likes: 8,
    dislikes: 0,
    // isBookmarked: false, //  check this state in other pr
  };

  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        {/* Header */}
        <div className="mb-6 flex items-start justify-between gap-4">
          <div className="flex-1">
            <h1 className="mb-4 text-balance text-2xl font-bold md:text-3xl">
              {post.title}
            </h1>
            <div className="flex flex-wrap items-center gap-2">
              {post.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Author Info */}
        <div className="mb-6 flex items-center justify-between border-b pb-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarFallback>{post.author[0]}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold">{post.author}</span>
                <Badge variant="secondary" className="text-xs">
                  Level {post.authorLevel}
                </Badge>
              </div>
              <div className="text-sm text-muted-foreground">
                {post.authorReputation} điểm danh tiếng • {post.createdAt}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Eye className="h-4 w-4" />
            <span>{post.views} lượt xem</span>
          </div>
        </div>

        {/* Content */}
        <div className="prose prose-slate mb-6 max-w-none dark:prose-invert">
          <div className="whitespace-pre-wrap text-foreground">
            {post.content}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between border-t pt-4">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <ThumbsUp className="mr-2 h-4 w-4" />
              Thích ({post.likes})
              <Button variant="outline" size="sm">
                <ThumbsDown className="mr-2 h-4 w-4" />
                {post.dislikes > 0 && `(${post.dislikes})`}
              </Button>
            </Button>
            <Button variant="outline" size="sm">
              <Bookmark className="mr-2 h-4 w-4" />
              Lưu
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm">
              <Share2 className="mr-2 h-4 w-4" />
              Chia sẻ
            </Button>
            <Button variant="ghost" size="sm">
              <Flag className="mr-2 h-4 w-4" />
              Báo cáo
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

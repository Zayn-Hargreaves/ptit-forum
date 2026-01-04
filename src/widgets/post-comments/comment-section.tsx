"use client";

import { useState } from "react";
import { ThumbsUp, MessageSquare, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@shared/ui/card/card";
import { Textarea } from "@shared/ui/textarea/textarea";
import { Button } from "@shared/ui/button/button";
import { Avatar, AvatarFallback } from "@shared/ui/avatar/avatar";
import { Badge } from "@shared/ui/badge/badge";

const comments = [
  {
    id: 1,
    author: "Trần Thị B",
    authorLevel: 5,
    content:
      "Bạn nên thử dùng Merge Sort hoặc Heap Sort cho input lớn. Quick Sort có worst case O(n²) khi pivot không tốt. Merge Sort luôn đảm bảo O(n log n).",
    createdAt: "1 giờ trước",
    likes: 5,
    isAnswer: true,
    replies: [
      {
        id: 11,
        author: "Nguyễn Văn A",
        authorLevel: 3,
        content: "Cảm ơn bạn! Mình sẽ thử Merge Sort xem sao.",
        createdAt: "45 phút trước",
        likes: 1,
      },
    ],
  },
  {
    id: 2,
    author: "Lê Văn C",
    authorLevel: 4,
    content:
      "Ngoài ra bạn có thể tối ưu Quick Sort bằng cách chọn pivot ngẫu nhiên hoặc dùng median-of-three. Điều này giúp tránh worst case.",
    createdAt: "30 phút trước",
    likes: 3,
    isAnswer: false,
    replies: [],
  },
];

export function CommentSection({ postId }: { postId: string }) {
  // postId is unused, pls check it in other pr
  const [newComment, setNewComment] = useState("");

  return (
    <div className="space-y-6">
      {/* Comment Form */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Trả lời</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Chia sẻ suy nghĩ của bạn..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            rows={4}
          />
          <div className="flex justify-end">
            <Button>Gửi bình luận</Button>
          </div>
        </CardContent>
      </Card>

      {/* Comments List */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">{comments.length} câu trả lời</h3>

        {comments.map((comment) => (
          <Card
            key={comment.id}
            className={
              comment.isAnswer
                ? "border-2 border-green-500/50 bg-green-50/50 dark:bg-green-950/20"
                : ""
            }
          >
            <CardContent className="p-6">
              {/* Comment Header */}
              <div className="mb-4 flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback>
                      {comment.author && comment.author.length
                        ? comment.author[0]
                        : "?"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{comment.author}</span>
                      <Badge variant="secondary" className="text-xs">
                        Level {comment.authorLevel}
                      </Badge>
                      {comment.isAnswer && (
                        <Badge
                          variant="default"
                          className="bg-green-500 text-xs"
                        >
                          <CheckCircle className="mr-1 h-3 w-3" />
                          Câu trả lời được chấp nhận
                        </Badge>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {comment.createdAt}
                    </div>
                  </div>
                </div>
              </div>

              {/* Comment Content */}
              <div className="mb-4 ml-13 text-foreground">
                {comment.content}
              </div>

              {/* Comment Actions */}
              <div className="ml-13 flex items-center gap-2">
                <Button variant="ghost" size="sm">
                  <ThumbsUp className="mr-2 h-4 w-4" />
                  {comment.likes}
                </Button>
                <Button variant="ghost" size="sm">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Trả lời
                </Button>
              </div>

              {/* Replies */}
              {comment.replies.length > 0 && (
                <div className="ml-13 mt-4 space-y-4 border-l-2 pl-4">
                  {comment.replies.map((reply) => (
                    <div key={reply.id}>
                      <div className="mb-2 flex items-start gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>
                            {reply.author && reply.author.length
                              ? reply.author[0]
                              : "?"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold">
                              {reply.author}
                            </span>
                            <Badge variant="secondary" className="text-xs">
                              Level {reply.authorLevel}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {reply.createdAt}
                            </span>
                          </div>
                          <div className="mt-1 text-sm text-foreground">
                            {reply.content}
                          </div>
                          <div className="mt-2 flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 text-xs"
                            >
                              <ThumbsUp className="mr-1 h-3 w-3" />
                              {reply.likes}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

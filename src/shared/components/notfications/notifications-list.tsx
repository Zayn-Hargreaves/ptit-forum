"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@shared/ui/avatar/avatar";
import { Badge } from "@shared/ui/badge/badge";
import { Button } from "@shared/ui/button/button";
import { Card, CardContent } from "@shared/ui/card/card";
import {
  MessageSquare,
  FileText,
  Calendar,
  ThumbsUp,
  UserPlus,
  Award,
  X,
} from "lucide-react";
import Link from "next/link";

const notifications = [
  {
    id: 1,
    type: "comment",
    title: "Nguyễn Văn A đã trả lời bài viết của bạn",
    content: "Cảm ơn bạn đã chia sẻ! Mình cũng đang gặp vấn đề tương tự...",
    link: "/forum/post/123",
    avatar: "/placeholder.svg",
    time: "5 phút trước",
    isRead: false,
  },
  {
    id: 2,
    type: "like",
    title: "Trần Thị B và 5 người khác đã thích bài viết của bạn",
    content: "Hướng dẫn cài đặt môi trường lập trình Java",
    link: "/forum/post/456",
    avatar: "/placeholder.svg",
    time: "1 giờ trước",
    isRead: false,
  },
  {
    id: 3,
    type: "document",
    title: "Tài liệu mới được thêm vào môn học của bạn",
    content: "Bài giảng Cấu trúc dữ liệu và giải thuật - Chương 5",
    link: "/documents/789",
    avatar: "/placeholder.svg",
    time: "2 giờ trước",
    isRead: false,
  },
  {
    id: 4,
    type: "event",
    title: "Sự kiện sắp diễn ra: Hội thảo AI & Machine Learning",
    content: "Sự kiện bắt đầu vào 15:00 ngày mai",
    link: "/events/1",
    avatar: "/placeholder.svg",
    time: "3 giờ trước",
    isRead: true,
  },
  {
    id: 5,
    type: "comment",
    title: "Lê Văn C đã nhắc đến bạn trong một bình luận",
    content: "@user Bạn có thể giải thích thêm về phần này được không?",
    link: "/forum/post/234",
    avatar: "/placeholder.svg",
    time: "5 giờ trước",
    isRead: true,
  },
  {
    id: 6,
    type: "achievement",
    title: "Chúc mừng! Bạn đã đạt cấp độ Contributor",
    content: "Bạn đã đóng góp 50 bài viết hữu ích cho cộng đồng",
    link: "/profile",
    avatar: "/placeholder.svg",
    time: "1 ngày trước",
    isRead: true,
  },
  {
    id: 7,
    type: "follow",
    title: "Phạm Thị D đã theo dõi bạn",
    content: "",
    link: "/profile/user-d",
    avatar: "/placeholder.svg",
    time: "2 ngày trước",
    isRead: true,
  },
  {
    id: 8,
    type: "document",
    title: "Tài liệu của bạn đã được duyệt",
    content: "Đề cương ôn tập Mạng máy tính",
    link: "/documents/890",
    avatar: "/placeholder.svg",
    time: "3 ngày trước",
    isRead: true,
  },
];

const getNotificationIcon = (type: string) => {
  switch (type) {
    case "comment":
      return <MessageSquare className="h-5 w-5 text-blue-500" />;
    case "like":
      return <ThumbsUp className="h-5 w-5 text-red-500" />;
    case "document":
      return <FileText className="h-5 w-5 text-green-500" />;
    case "event":
      return <Calendar className="h-5 w-5 text-purple-500" />;
    case "follow":
      return <UserPlus className="h-5 w-5 text-orange-500" />;
    case "achievement":
      return <Award className="h-5 w-5 text-yellow-500" />;
    default:
      return <MessageSquare className="h-5 w-5" />;
  }
};

export function NotificationsList() {
  return (
    <div className="space-y-3">
      {notifications.map((notification) => (
        <Card
          key={notification.id}
          className={`transition-all hover:border-primary/50 hover:shadow-md ${
            !notification.isRead
              ? "border-l-4 border-l-primary bg-primary/5"
              : ""
          }`}
        >
          <CardContent className="p-4">
            <div className="flex gap-4">
              <div className="relative">
                <Avatar className="h-12 w-12">
                  <AvatarImage
                    src={notification.avatar || "/placeholder.svg"}
                  />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-1 -right-1 rounded-full bg-background p-1">
                  {getNotificationIcon(notification.type)}
                </div>
              </div>

              <div className="flex-1">
                <div className="mb-1 flex items-start justify-between gap-2">
                  <Link href={notification.link} className="flex-1">
                    <h4 className="font-semibold leading-tight hover:text-primary">
                      {notification.title}
                    </h4>
                  </Link>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 shrink-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                {notification.content && (
                  <p className="mb-2 text-sm text-muted-foreground line-clamp-2">
                    {notification.content}
                  </p>
                )}

                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    {notification.time}
                  </span>
                  {!notification.isRead && (
                    <Badge variant="default" className="text-xs">
                      Mới
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

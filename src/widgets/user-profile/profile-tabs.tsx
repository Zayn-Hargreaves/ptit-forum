import { Badge } from "@shared/ui/badge/badge";
import { Card, CardContent } from "@shared/ui/card/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@shared/ui/tabs/tabs";
import { MessageSquare, FileText, Calendar, Award } from "lucide-react";
import Link from "next/link";
import { PostList } from "@shared/components/forum/post-list";

const userDocuments = [
  {
    id: 1,
    title: "Slide bài giảng OOP - Chương 1",
    subject: "OOP",
    downloads: 234,
    date: "1 tuần trước",
  },
  {
    id: 2,
    title: "Đề thi giữa kỳ Database 2023",
    subject: "Database",
    downloads: 189,
    date: "2 tuần trước",
  },
];

const userEvents = [
  {
    id: 1,
    title: "Hội thảo AI và Machine Learning",
    date: "2024-11-20",
    status: "Đã đăng ký",
  },
  {
    id: 2,
    title: "Workshop React & Next.js",
    date: "2024-11-22",
    status: "Đã đăng ký",
  },
];

const achievements = [
  {
    id: 1,
    title: "Người đóng góp tích cực",
    description: "Đạt 1000 điểm danh tiếng",
    icon: "🏆",
    date: "Tháng 10, 2024",
  },
  {
    id: 2,
    title: "Chuyên gia chia sẻ",
    description: "Tải lên 10 tài liệu",
    icon: "📚",
    date: "Tháng 9, 2024",
  },
  {
    id: 3,
    title: "Thành viên năng động",
    description: "100 bài viết được đăng",
    icon: "✨",
    date: "Tháng 8, 2024",
  },
];

interface ProfileTabsProps {
  userId: string;
}

export function ProfileTabs({ userId }: ProfileTabsProps) {
  return (
    <Tabs defaultValue="posts" className="space-y-6">
      <TabsList className="w-full justify-start border-b bg-transparent p-0 h-auto rounded-none">
        <TabsTrigger
          value="posts"
          className="relative rounded-none border-b-2 border-transparent bg-transparent px-4 py-3 pb-4 pt-3 font-semibold text-muted-foreground shadow-none transition-none data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:shadow-none hover:text-foreground"
        >
          Bài viết
        </TabsTrigger>
        <TabsTrigger
          value="comments"
          className="relative rounded-none border-b-2 border-transparent bg-transparent px-4 py-3 pb-4 pt-3 font-semibold text-muted-foreground shadow-none transition-none data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:shadow-none hover:text-foreground"
        >
          Bình luận
        </TabsTrigger>
        <TabsTrigger
          value="documents"
          className="relative rounded-none border-b-2 border-transparent bg-transparent px-4 py-3 pb-4 pt-3 font-semibold text-muted-foreground shadow-none transition-none data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:shadow-none hover:text-foreground"
        >
          Tài liệu
        </TabsTrigger>
        <TabsTrigger
          value="events"
          className="relative rounded-none border-b-2 border-transparent bg-transparent px-4 py-3 pb-4 pt-3 font-semibold text-muted-foreground shadow-none transition-none data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:shadow-none hover:text-foreground"
        >
          Sự kiện
        </TabsTrigger>
        <TabsTrigger
          value="achievements"
          className="relative rounded-none border-b-2 border-transparent bg-transparent px-4 py-3 pb-4 pt-3 font-semibold text-muted-foreground shadow-none transition-none data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:shadow-none hover:text-foreground"
        >
          Thành tích
        </TabsTrigger>
      </TabsList>

      <TabsContent value="posts" className="space-y-4">
        <PostList authorId={userId} sortMode="latest" timeRange="all" />
      </TabsContent>

      <TabsContent value="comments" className="space-y-4">
        <Card>
          <CardContent className="p-6 text-center text-muted-foreground">
            <MessageSquare className="mx-auto mb-2 h-12 w-12 opacity-50" />
            <p>Lịch sử bình luận của bạn sẽ hiển thị ở đây</p>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="documents" className="space-y-4">
        {userDocuments.map((doc) => (
          <Card key={doc.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <FileText className="h-5 w-5 text-primary" />
                  <div className="flex-1">
                    <Link href={`/documents/${doc.id}`}>
                      <h3 className="mb-2 font-semibold hover:text-primary">
                        {doc.title}
                      </h3>
                    </Link>
                    <div className="mb-2">
                      <Badge variant="secondary">{doc.subject}</Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{doc.downloads} lượt tải</span>
                      <span>{doc.date}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </TabsContent>

      <TabsContent value="events" className="space-y-4">
        {userEvents.map((event) => (
          <Card key={event.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-primary" />
                  <div className="flex-1">
                    <Link href={`/events/${event.id}`}>
                      <h3 className="mb-2 font-semibold hover:text-primary">
                        {event.title}
                      </h3>
                    </Link>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>
                        {(() => {
                          const date = new Date(event.date);
                          return isNaN(date.getTime())
                            ? "Ngày không xác định"
                            : date.toLocaleDateString("vi-VN");
                        })()}
                      </span>
                      <Badge variant="default">{event.status}</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </TabsContent>

      <TabsContent value="achievements" className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          {achievements.map((achievement) => (
            <Card key={achievement.id}>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="text-4xl">{achievement.icon}</div>
                  <div className="flex-1">
                    <h3 className="mb-1 font-semibold">{achievement.title}</h3>
                    <p className="mb-2 text-sm text-muted-foreground">
                      {achievement.description}
                    </p>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Award className="h-3 w-3" />
                      <span>{achievement.date}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </TabsContent>
    </Tabs>
  );
}

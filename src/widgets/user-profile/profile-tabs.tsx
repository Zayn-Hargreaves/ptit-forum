import { Badge } from "@shared/ui/badge/badge";
import { Card, CardContent } from "@shared/ui/card/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@shared/ui/tabs/tabs";
import { MessageSquare, FileText, Calendar, Award } from "lucide-react";
import Link from "next/link";

const userPosts = [
  {
    id: 1,
    title: "Làm thế nào để tối ưu hóa thuật toán sắp xếp?",
    box: "Lập trình & Thuật toán",
    comments: 12,
    likes: 8,
    date: "2 ngày trước",
  },
  {
    id: 2,
    title: "Chia sẻ kinh nghiệm phỏng vấn thực tập FPT",
    box: "Thực tập & Nghề nghiệp",
    comments: 32,
    likes: 23,
    date: "1 tuần trước",
  },
];

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

// pls implement api later

export function ProfileTabs() {
  return (
    <Tabs defaultValue="posts" className="space-y-6">
      <TabsList>
        <TabsTrigger value="posts">Bài viết</TabsTrigger>
        <TabsTrigger value="comments">Bình luận</TabsTrigger>
        <TabsTrigger value="documents">Tài liệu</TabsTrigger>
        <TabsTrigger value="events">Sự kiện</TabsTrigger>
        <TabsTrigger value="achievements">Thành tích</TabsTrigger>
      </TabsList>

      <TabsContent value="posts" className="space-y-4">
        {userPosts.map((post) => (
          <Card key={post.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <Link href={`/forum/post/${post.id}`}>
                    <h3 className="mb-2 text-lg font-semibold hover:text-primary">
                      {post.title}
                    </h3>
                  </Link>
                  <div className="mb-2">
                    <Badge variant="secondary">{post.box}</Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MessageSquare className="h-4 w-4" />
                      <span>{post.comments} bình luận</span>
                    </div>
                    <span>{post.likes} lượt thích</span>
                    <span>{post.date}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
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

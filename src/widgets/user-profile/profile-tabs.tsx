import { useMyDocuments } from '@entities/document/queries';
import { ProfileDashboard } from '@features/dashboard/ui/profile-dashboard';
import { PostList } from '@shared/components/forum/post-list';
import { Badge } from '@shared/ui/badge/badge';
import { Card, CardContent } from '@shared/ui/card/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@shared/ui/tabs/tabs';
import { Award, Calendar, FileText, MessageSquare } from 'lucide-react';
import Link from 'next/link';

const userEvents = [
  {
    id: 1,
    title: 'Hội thảo AI và Machine Learning',
    date: '2024-11-20',
    status: 'Đã đăng ký',
  },
  {
    id: 2,
    title: 'Workshop React & Next.js',
    date: '2024-11-22',
    status: 'Đã đăng ký',
  },
];

const achievements = [
  {
    id: 1,
    title: 'Người đóng góp tích cực',
    description: 'Đạt 1000 điểm danh tiếng',
    icon: '🏆',
    date: 'Tháng 10, 2024',
  },
  {
    id: 2,
    title: 'Chuyên gia chia sẻ',
    description: 'Tải lên 10 tài liệu',
    icon: '📚',
    date: 'Tháng 9, 2024',
  },
  {
    id: 3,
    title: 'Thành viên năng động',
    description: '100 bài viết được đăng',
    icon: '✨',
    date: 'Tháng 8, 2024',
  },
];

interface ProfileTabsProps {
  userId: string;
  isOwnProfile?: boolean;
}

export function ProfileTabs({ userId, isOwnProfile }: ProfileTabsProps) {
  const { data: myDocumentsData } = useMyDocuments(
    isOwnProfile ? { page: 1, limit: 100 } : undefined, // Only fetch if own profile
  );

  // If not own profile, we might want to fetch public docs of this user, but for now handle "My Docs" request first.
  // The user specifically asked for "của cá nhân đăng tải" in "giao diện profile".
  // Assuming this refers to managing OWN documents.
  const documents = isOwnProfile ? myDocumentsData?.data || [] : [];

  const defaultTab = isOwnProfile ? 'dashboard' : 'posts';

  return (
    <Tabs defaultValue={defaultTab} className="space-y-6">
      <TabsList className="h-auto w-full justify-start rounded-none border-b bg-transparent p-0">
        {isOwnProfile && (
          <TabsTrigger
            value="dashboard"
            className="text-muted-foreground data-[state=active]:border-primary data-[state=active]:text-primary hover:text-foreground relative rounded-none border-b-2 border-transparent bg-transparent px-4 py-3 pt-3 pb-4 font-semibold shadow-none transition-none data-[state=active]:shadow-none"
          >
            Tổng quan
          </TabsTrigger>
        )}
        <TabsTrigger
          value="posts"
          className="text-muted-foreground data-[state=active]:border-primary data-[state=active]:text-primary hover:text-foreground relative rounded-none border-b-2 border-transparent bg-transparent px-4 py-3 pt-3 pb-4 font-semibold shadow-none transition-none data-[state=active]:shadow-none"
        >
          Bài viết
        </TabsTrigger>
        <TabsTrigger
          value="comments"
          className="text-muted-foreground data-[state=active]:border-primary data-[state=active]:text-primary hover:text-foreground relative rounded-none border-b-2 border-transparent bg-transparent px-4 py-3 pt-3 pb-4 font-semibold shadow-none transition-none data-[state=active]:shadow-none"
        >
          Bình luận
        </TabsTrigger>
        <TabsTrigger
          value="documents"
          className="text-muted-foreground data-[state=active]:border-primary data-[state=active]:text-primary hover:text-foreground relative rounded-none border-b-2 border-transparent bg-transparent px-4 py-3 pt-3 pb-4 font-semibold shadow-none transition-none data-[state=active]:shadow-none"
        >
          Tài liệu
        </TabsTrigger>
        <TabsTrigger
          value="events"
          className="text-muted-foreground data-[state=active]:border-primary data-[state=active]:text-primary hover:text-foreground relative rounded-none border-b-2 border-transparent bg-transparent px-4 py-3 pt-3 pb-4 font-semibold shadow-none transition-none data-[state=active]:shadow-none"
        >
          Sự kiện
        </TabsTrigger>
        <TabsTrigger
          value="achievements"
          className="text-muted-foreground data-[state=active]:border-primary data-[state=active]:text-primary hover:text-foreground relative rounded-none border-b-2 border-transparent bg-transparent px-4 py-3 pt-3 pb-4 font-semibold shadow-none transition-none data-[state=active]:shadow-none"
        >
          Thành tích
        </TabsTrigger>
      </TabsList>

      {isOwnProfile && (
        <TabsContent value="dashboard" className="space-y-4">
          <ProfileDashboard />
        </TabsContent>
      )}

      <TabsContent value="posts" className="space-y-4">
        <PostList authorId={userId} sortMode="latest" timeRange="all" />
      </TabsContent>

      <TabsContent value="comments" className="space-y-4">
        <Card>
          <CardContent className="text-muted-foreground p-6 text-center">
            <MessageSquare className="mx-auto mb-2 h-12 w-12 opacity-50" />
            <p>Lịch sử bình luận của bạn sẽ hiển thị ở đây</p>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="documents" className="space-y-4">
        {documents.length === 0 ? (
          <Card>
            <CardContent className="text-muted-foreground p-6 text-center">
              <FileText className="mx-auto mb-2 h-12 w-12 opacity-50" />
              <p>
                {isOwnProfile
                  ? 'Bạn chưa tải lên tài liệu nào'
                  : 'Người dùng chưa tải lên tài liệu nào'}
              </p>
            </CardContent>
          </Card>
        ) : (
          documents.map((doc) => (
            <Card key={doc.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <FileText className="text-primary h-5 w-5" />
                    <div className="flex-1">
                      <Link href={`/documents/${doc.id}`}>
                        <h3 className="hover:text-primary mb-2 font-semibold">{doc.title}</h3>
                      </Link>
                      <div className="mb-2">
                        {/* Subject name might need specific mapping if full object not returned, but Service maps it */}
                        <Badge variant="secondary">{doc.subject?.name || 'Chưa phân loại'}</Badge>
                        {/* Show Status for Owner */}
                        {isOwnProfile && (
                          <Badge
                            variant={doc.status === 'APPROVED' ? 'default' : 'outline'}
                            className="ml-2"
                          >
                            {doc.status}
                          </Badge>
                        )}
                      </div>
                      <div className="text-muted-foreground flex items-center gap-4 text-sm">
                        <span>{doc.downloadCount} lượt tải</span>
                        <span>{new Date(doc.uploadDate).toLocaleDateString('vi-VN')}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </TabsContent>

      <TabsContent value="events" className="space-y-4">
        {userEvents.map((event) => (
          <Card key={event.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <Calendar className="text-primary h-5 w-5" />
                  <div className="flex-1">
                    <Link href={`/events/${event.id}`}>
                      <h3 className="hover:text-primary mb-2 font-semibold">{event.title}</h3>
                    </Link>
                    <div className="text-muted-foreground flex items-center gap-4 text-sm">
                      <span>
                        {(() => {
                          const date = new Date(event.date);
                          return isNaN(date.getTime())
                            ? 'Ngày không xác định'
                            : date.toLocaleDateString('vi-VN');
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
                    <p className="text-muted-foreground mb-2 text-sm">{achievement.description}</p>
                    <div className="text-muted-foreground flex items-center gap-1 text-xs">
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

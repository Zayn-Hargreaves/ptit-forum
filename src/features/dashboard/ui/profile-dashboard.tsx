import { useUserStats } from '@features/profile/api/use-user-stats';
import { useAuth } from '@shared/providers/auth-provider';
import { Button, Card, CardContent, CardHeader, CardTitle } from '@shared/ui';
import { Eye, FileText, MessageSquare } from 'lucide-react';
import Link from 'next/link';
interface ProfileDashboardProps {
  userId?: string;
}

export function ProfileDashboard({ userId }: ProfileDashboardProps) {
  const { user } = useAuth();
  // If userId is provided, use it. Otherwise use current user's ID.
  const targetId = userId || user?.id || '';

  const { data: stats, isLoading } = useUserStats(targetId);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Tổng quan</h2>
        <div className="flex items-center gap-2">
          {user?.id === targetId && (
            <Button asChild>
              <Link href="/documents/upload">Tải lên tài liệu</Link>
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tài liệu đã tải</CardTitle>
            <FileText className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? '...' : stats?.documentCount || 0}
            </div>
            <p className="text-muted-foreground text-xs">tài liệu đã được duyệt</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bài viết diễn đàn</CardTitle>
            <MessageSquare className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoading ? '...' : stats?.postCount || 0}</div>
            <p className="text-muted-foreground text-xs">bài viết được công khai</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Độ uy tín</CardTitle>
            <Eye className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoading ? '...' : stats?.reputation || 0}</div>
            <p className="text-muted-foreground text-xs">điểm đóng góp</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Hoạt động gần đây</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-muted-foreground py-10 text-center text-sm">
              Chưa có hoạt động nào.
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Liên kết nhanh</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-2">
            <Button variant="outline" className="justify-start" asChild>
              <Link href={`/profile/${targetId}?tab=documents`}>Xem tài liệu</Link>
            </Button>
            <Button variant="outline" className="justify-start" asChild>
              <Link href={`/profile/${targetId}?tab=posts`}>Xem bài viết</Link>
            </Button>
            {user?.id === targetId && (
              <Button variant="outline" className="justify-start" asChild>
                <Link href="/settings/profile">Cài đặt tài khoản</Link>
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

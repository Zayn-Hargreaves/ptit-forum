import { useMyDocuments, usePublicDocuments } from '@entities/document/queries';
import { ProfileDashboard } from '@features/dashboard/ui/profile-dashboard';
import { UserCommentList } from '@features/profile/ui/user-comment-list';
import { PostList } from '@shared/components/forum/post-list';
import { Badge } from '@shared/ui/badge/badge';
import { Card, CardContent } from '@shared/ui/card/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@shared/ui/tabs/tabs';
import { FileText } from 'lucide-react';
import Link from 'next/link';

interface ProfileTabsProps {
  userId: string;
  isOwnProfile?: boolean;
}

export function ProfileTabs({ userId, isOwnProfile }: ProfileTabsProps) {
  // Logic: If own profile, use useMyDocuments. If other, use usePublicDocuments.
  const { data: myDocumentsData } = useMyDocuments(
    isOwnProfile ? { page: 1, limit: 100 } : undefined,
  );

  const { data: publicDocumentsData } = usePublicDocuments(
    !isOwnProfile ? { page: 1, limit: 100, uploaderId: userId } : undefined,
  );

  const documents = isOwnProfile ? myDocumentsData?.data || [] : publicDocumentsData?.data || [];

  const defaultTab = isOwnProfile ? 'dashboard' : 'posts';

  return (
    <Tabs defaultValue={defaultTab} className="space-y-6">
      <TabsList className="h-auto w-full justify-start rounded-none border-b bg-transparent p-0">
        <TabsTrigger
          value="dashboard"
          className="text-muted-foreground data-[state=active]:border-primary data-[state=active]:text-primary hover:text-foreground relative rounded-none border-b-2 border-transparent bg-transparent px-4 py-3 pt-3 pb-4 font-semibold shadow-none transition-none data-[state=active]:shadow-none"
        >
          Tổng quan
        </TabsTrigger>
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
      </TabsList>

      <TabsContent value="dashboard" className="space-y-4">
        <ProfileDashboard userId={userId} />
      </TabsContent>

      <TabsContent value="posts" className="space-y-4">
        <PostList authorId={userId} sortMode="latest" timeRange="all" />
      </TabsContent>

      <TabsContent value="comments" className="space-y-4">
        <UserCommentList userId={userId} />
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
                        <Badge variant="secondary">{doc.subject?.name || 'Chưa phân loại'}</Badge>
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
    </Tabs>
  );
}

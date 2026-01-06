'use client';

import { postApi } from '@entities/post/api/post-api';
import { PostImageGrid } from '@entities/post/ui/post-image-grid';
import { PostActionMenu } from '@features/post/update-post/ui/post-action-menu';
import { CommentSection } from '@features/post-comment/ui/comment-section';
import { ReactionButton } from '@features/post-reaction/ui/reaction-button';
import { getAvatarUrl, getUserDisplayName } from '@shared/lib/user-display-utils';
import { Button } from '@shared/ui/button/button';
import { FileDownloadButton } from '@shared/ui/file-download-button';
import { UserAvatar } from '@shared/ui/user-avatar/user-avatar';
import { useQuery } from '@tanstack/react-query';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';

export default function PostDetailPage() {
  const { postId } = useParams<{ postId: string }>();
  const router = useRouter();

  const {
    data: post,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['post', postId],
    queryFn: () => postApi.getDetail(postId),
    enabled: !!postId,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="text-primary h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (isError || !post) {
    return (
      <div className="space-y-4 py-20 text-center">
        <h2 className="text-xl font-semibold">Không tìm thấy bài viết</h2>
        <Button variant="outline" onClick={() => router.back()}>
          Quay lại
        </Button>
      </div>
    );
  }

  // User info with fallbacks
  const authorName = getUserDisplayName(post.author?.fullName);
  const authorAvatar = getAvatarUrl(post.author?.avatarUrl);

  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      <Button
        variant="ghost"
        className="mb-4 gap-2 pl-0 transition-all hover:pl-2"
        onClick={() => router.back()}
      >
        <ArrowLeft className="h-4 w-4" />
        Quay lại
      </Button>

      <div className="bg-card overflow-hidden rounded-xl border shadow-sm">
        {/* Header */}
        <div className="border-b p-6">
          <h1 className="mb-4 text-2xl font-bold">{post.title}</h1>
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <UserAvatar name={authorName} avatarUrl={authorAvatar} className="h-10 w-10 border" />
              <div>
                <div className="font-semibold">{authorName}</div>
                <div className="text-muted-foreground text-xs">
                  {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true, locale: vi })}
                </div>
              </div>
            </div>

            {/* Action Menu (3 dots) */}
            <PostActionMenu post={post} isDetailView={true} />
          </div>
        </div>

        {/* Content */}
        <div className="space-y-6 p-6">
          {/* Text Content */}
          <div
            className="prose dark:prose-invert text-foreground max-w-none leading-relaxed"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Images */}
          {post.images && post.images.length > 0 && (
            <div className="mt-4">
              <PostImageGrid images={post.images} />
            </div>
          )}

          {/* Documents */}
          {post.documents && post.documents.length > 0 && (
            <div className="mt-6 space-y-3">
              <h3 className="text-foreground/80 text-sm font-semibold">
                Tài liệu đính kèm ({post.documents.length})
              </h3>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {post.documents.map((doc, idx) => (
                  <div
                    key={idx}
                    className="bg-muted/30 hover:bg-muted/50 flex items-center justify-between rounded-lg border p-3 transition-colors"
                  >
                    <div className="flex items-center gap-3 truncate">
                      <div className="bg-primary/10 text-primary flex h-8 w-8 shrink-0 items-center justify-center rounded text-xs font-bold uppercase">
                        {doc.name.split('.').pop() || 'FILE'}
                      </div>
                      <span className="truncate text-sm font-medium" title={doc.name}>
                        {doc.name}
                      </span>
                    </div>
                    <div className="ml-4 shrink-0">
                      <FileDownloadButton fileName={doc.name} fileUrl={doc.url} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="bg-muted/5 flex items-center justify-between border-t border-b p-4">
          <ReactionButton
            postId={post.id}
            initialLikeCount={post.stats?.likeCount || 0}
            initialIsLiked={post.isLiked}
            queryKey={['post', post.id]} // Direct update to this query
          />
          <div className="text-muted-foreground text-sm">{post.stats?.viewCount || 0} lượt xem</div>
        </div>

        {/* Comments Section - Reuse existing component */}
        <div className="bg-muted/10 p-0">
          <CommentSection postId={post.id} />
        </div>
      </div>
    </div>
  );
}

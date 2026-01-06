'use client';

import { TargetType } from '@entities/interaction/model/types';
import { postApi } from '@entities/post/api/post-api';
import { PostImageGrid } from '@entities/post/ui/post-image-grid';
import { PostActionMenu } from '@features/post/update-post/ui/post-action-menu';
import { ReactionButton } from '@features/post-reaction/ui/reaction-button';
import { getAvatarUrl, getUserDisplayName } from '@shared/lib/user-display-utils';
import { Button } from '@shared/ui/button/button';
import { FileDownloadButton } from '@shared/ui/file-download-button';
import { UserAvatar } from '@shared/ui/user-avatar/user-avatar';
import { useQuery } from '@tanstack/react-query';
import { CommentSection } from '@widgets/post-comments/comment-section';
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
    <div className="mx-auto max-w-4xl px-4 py-8">
      {/* Navigation */}
      <Button
        variant="ghost"
        className="text-muted-foreground hover:text-foreground mb-6 gap-2 pl-0 transition-all hover:pl-2"
        onClick={() => router.back()}
      >
        <ArrowLeft className="h-4 w-4" />
        Quay lại diễn đàn
      </Button>

      {/* Main Content Card */}
      <div className="bg-card overflow-hidden rounded-xl border shadow-sm">
        <div className="border-b p-6 md:p-8">
          <div className="mb-6 flex items-start justify-between gap-4">
            <h1 className="text-2xl leading-tight font-bold md:text-3xl">{post.title}</h1>
            <PostActionMenu post={post} isDetailView={true} />
          </div>

          <div className="flex items-center gap-4">
            {post.author?.id ? (
              <UserAvatar
                name={authorName}
                avatarUrl={authorAvatar}
                className="h-12 w-12 border-2"
              />
            ) : (
              <UserAvatar name={authorName} avatarUrl={authorAvatar} className="h-12 w-12 border" />
            )}
            <div className="grid gap-0.5">
              <span className="text-base font-semibold">{authorName}</span>
              <div className="text-muted-foreground flex items-center gap-2 text-sm">
                <span>
                  {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true, locale: vi })}
                </span>
                <span
                  id="debug-post-date"
                  className="hidden"
                  data-raw={JSON.stringify(post._debugRaw)}
                >
                  {JSON.stringify(post._debugRaw)}
                </span>
                <span>•</span>
                <span>{post.stats?.viewCount || 0} lượt xem</span>
              </div>
            </div>
          </div>
        </div>

        {/* Post Body */}
        <div className="p-6 md:p-8">
          <div
            className="prose prose-lg dark:prose-invert max-w-none leading-relaxed break-words"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Images Grid */}
          {post.images && post.images.length > 0 && (
            <div className="mt-8">
              <PostImageGrid images={post.images} />
            </div>
          )}

          {post.documents && post.documents.length > 0 && (
            <div className="bg-muted/30 mt-8 space-y-4 rounded-lg border p-4">
              <h3 className="text-muted-foreground flex items-center gap-2 text-sm font-semibold tracking-wide uppercase">
                <span className="bg-primary h-1.5 w-1.5 rounded-full" />
                Tài liệu đính kèm ({post.documents.length})
              </h3>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {post.documents.map((doc, idx) => (
                  <div
                    key={idx}
                    className="bg-background hover:border-primary/50 group flex items-center justify-between rounded-md border p-3 transition-all"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="bg-primary/10 text-primary flex h-10 w-10 shrink-0 items-center justify-center rounded text-xs font-bold uppercase">
                        {doc.name.split('.').pop() || 'FILE'}
                      </div>
                      <div className="grid min-w-0 gap-0.5">
                        <span className="group-hover:text-primary truncate text-sm font-medium transition-colors">
                          {doc.name}
                        </span>
                        <span className="text-muted-foreground text-xs">Nhấn để tải xuống</span>
                      </div>
                    </div>
                    <div className="ml-4 shrink-0 opacity-0 transition-opacity group-hover:opacity-100">
                      <FileDownloadButton fileName={doc.name} fileUrl={doc.url} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Reaction Bar */}
        <div className="bg-muted/5 flex items-center justify-between border-t px-6 py-4 md:px-8">
          <ReactionButton
            targetId={post.id}
            targetType={TargetType.POST}
            initialLikeCount={post.stats?.likeCount || 0}
            initialIsLiked={post.isLiked}
            queryKey={['post', post.id]}
          />
          <div className="text-muted-foreground text-sm">
            {post.stats?.commentCount || 0} bình luận
          </div>
        </div>
      </div>

      {/* Comments Section */}
      <div className="mt-8">
        <h3 className="mb-4 flex items-center gap-2 text-xl font-bold">
          Bình luận
          <span className="text-muted-foreground text-base font-normal">
            ({post.stats?.commentCount || 0})
          </span>
        </h3>
        <CommentSection postId={post.id} />
      </div>
    </div>
  );
}

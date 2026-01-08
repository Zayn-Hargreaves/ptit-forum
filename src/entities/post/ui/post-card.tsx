'use client';

import { PostActionMenu } from '@features/post/update-post/ui/post-action-menu';
import { cn } from '@shared/lib/utils';
import { Button } from '@shared/ui/button/button';
import { Card, CardContent, CardFooter, CardHeader } from '@shared/ui/card/card';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import { AlertCircle, Clock, Eye, MessageSquare, Share2, Shield } from 'lucide-react';
import Link from 'next/link';

import { IPost } from '../model/types';
import { PostImageGrid } from './post-image-grid';

interface PostCardProps {
  post: IPost;
  topicId: string; // Added for context (Reactions/Comments query key)
}

import { ReactionButton } from '@features/post-reaction/ui/reaction-button';
import { stripHtml } from '@shared/lib/html-utils';
import { getAvatarUrl, getUserDisplayName } from '@shared/lib/user-display-utils';
import { UserAvatar } from '@shared/ui/user-avatar/user-avatar';

export function PostCard({ post, topicId }: PostCardProps) {
  const likes = post.stats?.likeCount ?? 0;
  const comments = post.stats?.commentCount ?? 0;
  const views = post.stats?.viewCount ?? 0;

  // User info with fallbacks
  const authorName = getUserDisplayName(post.author?.fullName || post.author?.email);
  const authorAvatar = getAvatarUrl(post.author?.avatarUrl);

  const authorId = post.author?.id;

  // Ghost Post Pattern: Check if post is pending approval
  const isPending = post.postStatus === 'PENDING';
  const isRejected = post.postStatus === 'REJECTED';

  return (
    <Card
      className={cn(
        'hover:border-primary/50 group mb-4 transition-all',
        // Ghost Post styling for pending posts
        isPending && 'border-yellow-400/60 bg-yellow-50/40 opacity-90 shadow-sm',
        // Rejected posts - show with red tint
        isRejected && 'border-red-400/60 bg-red-50/30 opacity-85',
      )}
    >
      <CardHeader className="flex flex-row items-start gap-4 space-y-0 p-4 pb-0">
        {authorId ? (
          <Link href={`/profile/${authorId}`} onClick={(e) => e.stopPropagation()}>
            <UserAvatar
              name={authorName}
              avatarUrl={authorAvatar}
              className="h-10 w-10 cursor-pointer"
            />
          </Link>
        ) : (
          <UserAvatar name={authorName} avatarUrl={authorAvatar} className="h-10 w-10 border" />
        )}
        <div className="flex-1 space-y-0.5">
          {authorId ? (
            <Link
              href={`/profile/${authorId}`}
              className="text-sm font-semibold hover:underline"
              onClick={(e) => e.stopPropagation()}
            >
              {authorName}
            </Link>
          ) : (
            <span className="text-sm font-semibold">{authorName}</span>
          )}
          <p className="text-muted-foreground text-xs">
            {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true, locale: vi })}
          </p>
        </div>

        {/* Status Badge & Action Menu */}
        <div className="flex items-center gap-2">
          {/* Status Badge for Pending/Rejected */}
          {isPending && (
            <div className="flex items-center gap-1.5 rounded-md border border-yellow-200 bg-yellow-100 px-2.5 py-1">
              <Clock className="h-3.5 w-3.5 text-yellow-700" />
              <span className="text-xs font-medium text-yellow-800">Chờ duyệt</span>
            </div>
          )}
          {isRejected && (
            <div className="flex items-center gap-1.5 rounded-md border border-red-200 bg-red-100 px-2.5 py-1">
              <Shield className="h-3.5 w-3.5 text-red-700" />
              <span className="text-xs font-medium text-red-800">Đã từ chối</span>
            </div>
          )}

          {/* Action Menu (3 dots) */}
          <PostActionMenu post={post} />
        </div>
      </CardHeader>

      <CardContent className="p-4 pt-3 pb-2">
        <Link href={`/forum/post/${post.id}`} className="block">
          <h3 className="group-hover:text-primary mb-2 line-clamp-2 text-lg font-bold transition-colors">
            {post.title}
          </h3>
          <p className="text-muted-foreground line-clamp-3 text-sm leading-relaxed">
            {stripHtml(post.content)}
          </p>
        </Link>

        {/* Images Grid */}
        {post.images && post.images.length > 0 && (
          <div className="mt-3 cursor-pointer" onClick={() => console.log('View images')}>
            <PostImageGrid images={post.images} />
          </div>
        )}

        {/* Helper text for pending posts - Explain moderation status */}
        {isPending && (
          <div className="mt-3 flex items-start gap-2 rounded-md border border-yellow-200/50 bg-yellow-100/60 p-2.5 text-xs text-yellow-800">
            <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
            <div className="flex-1">
              <p className="mb-0.5 font-medium">Bài viết đang chờ phê duyệt</p>
              <p className="text-yellow-700/90">
                Bài viết này chỉ hiển thị với bạn và quản trị viên. Sau khi được duyệt, bài sẽ hiển
                thị công khai cho tất cả thành viên.
              </p>
            </div>
          </div>
        )}

        {isRejected && (
          <div className="mt-3 flex items-start gap-2 rounded-md border border-red-200/50 bg-red-100/60 p-2.5 text-xs text-red-800">
            <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
            <div className="flex-1">
              <p className="mb-0.5 font-medium">Bài viết bị từ chối</p>
              <p className="text-red-700/90">
                Bài viết này không được phê duyệt bởi quản trị viên và chỉ hiển thị với bạn.
              </p>
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="bg-muted/5 flex justify-between border-t p-2 px-4">
        <div className="flex gap-1">
          <ReactionButton
            topicId={topicId}
            targetId={post.id}
            initialLikeCount={likes}
            initialIsLiked={post.isLiked}
          />
          <Link
            href={`/forum/post/${post.id}`}
            className="text-muted-foreground inline-flex h-8 items-center justify-center gap-2 rounded-md px-2 text-xs font-medium transition-colors hover:bg-blue-50 hover:text-blue-500"
          >
            <MessageSquare className="h-4 w-4" />
            <span>{comments} bình luận</span>
          </Link>
        </div>

        <div className="text-muted-foreground flex items-center gap-2 text-xs">
          <span className="flex items-center gap-1">
            <Eye className="h-3.5 w-3.5" /> {views}
          </span>
          <Button variant="ghost" size="icon" className="ml-1 h-8 w-8">
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}

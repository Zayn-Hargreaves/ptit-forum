// src/entities/post/ui/post-item.tsx
'use client';

import { ReactionButton } from '@features/reaction/ui/reaction-button';
import { Badge } from '@shared/ui/badge/badge';
import { Card, CardContent, CardFooter, CardHeader } from '@shared/ui/card/card';
import { UserAvatar } from '@shared/ui/user-avatar/user-avatar';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Eye, MessageSquare } from 'lucide-react';
import Link from 'next/link';

import type { Post } from '../model/types';

interface PostItemProps {
  post: Post;
  actions?: React.ReactNode;
}

const formatPostDate = (dateTime: string | undefined) => {
  if (!dateTime) return '';
  const date = new Date(dateTime);
  if (Number.isNaN(date.getTime())) return '';
  return formatDistanceToNow(date, { addSuffix: true, locale: vi });
};

export function PostItem({ post, actions }: Readonly<PostItemProps>) {
  // Defensive checks
  const authorName = post.author?.fullName || post.author?.email || 'Người dùng ẩn danh';
  const authorAvatar = post.author?.avatarUrl;
  const topicName = post.topic?.name ?? 'General';

  const displayExcerpt = stripHtml(post.content);

  return (
    <Card className="group hover:border-primary/50 hover:border-l-primary relative flex flex-col border-l-4 border-l-transparent transition-all duration-200 hover:shadow-md">
      <Link href={`/posts/${post.id}`} className="absolute inset-0 z-0" prefetch={false}>
        <span className="sr-only">Xem chi tiết {post.title}</span>
      </Link>

      <CardHeader className="space-y-0 p-6 pb-2">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            {post.author?.id ? (
              <Link
                href={`/profile/${post.author.id}`}
                className="relative z-10 transition-opacity hover:opacity-80"
              >
                <UserAvatar
                  name={post.author.fullName}
                  avatarUrl={authorAvatar}
                  className="h-10 w-10 border"
                />
              </Link>
            ) : (
              <span className="relative z-10">
                <UserAvatar
                  name={post.author?.fullName}
                  avatarUrl={authorAvatar}
                  className="h-10 w-10 border"
                />
              </span>
            )}

            <div className="flex min-w-0 flex-col">
              {post.author?.id ? (
                <Link
                  href={`/profile/${post.author.id}`}
                  className="relative z-10 max-w-[200px] truncate text-sm leading-none font-semibold hover:underline"
                >
                  {authorName}
                </Link>
              ) : (
                <span className="relative z-10 max-w-[200px] truncate text-sm leading-none font-semibold">
                  {authorName}
                </span>
              )}
              <div className="mt-1.5 flex items-center gap-2">
                <span
                  className="text-muted-foreground text-xs whitespace-nowrap"
                  suppressHydrationWarning
                >
                  {formatPostDate(post.createdAt)}
                </span>

                {/* Topic Badge */}
                <Badge
                  variant="secondary"
                  className="hover:bg-secondary/80 relative z-10 h-5 px-1.5 py-0 text-[10px] font-normal"
                >
                  {topicName}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>

      {/* ================= CONTENT ================= */}
      <CardContent className="flex-1 p-6 pt-2 pb-4">
        <h3 className="group-hover:text-primary mb-2 line-clamp-2 text-lg leading-tight font-bold tracking-tight transition-colors">
          {post.title}
        </h3>

        <p className="text-muted-foreground line-clamp-2 text-sm leading-relaxed">
          {displayExcerpt}
        </p>
      </CardContent>

      {/* ================= FOOTER ================= */}
      <CardFooter className="mt-auto flex items-center justify-between p-6 pt-0">
        {/* Actions Area (e.g. Approve/Reject) */}
        {actions && <div className="z-20 mr-4 flex gap-2">{actions}</div>}

        {/* Stats Area - Chỉ là thông tin, click xuyên qua vào bài viết */}
        <div className="text-muted-foreground flex items-center gap-4 text-xs font-medium">
          <div className="bg-muted/30 flex items-center gap-1.5 rounded-md px-2 py-1">
            <Eye className="h-3.5 w-3.5" />
            <span>{post.stats?.viewCount ?? 0}</span>
          </div>
          <div className="bg-muted/30 flex items-center gap-1.5 rounded-md px-2 py-1">
            <MessageSquare className="h-3.5 w-3.5" />
            <span>{post.stats?.commentCount ?? 0}</span>
          </div>
        </div>

        {/* 🛑 LAYER 1: REACTION BUTTON 
           Nút Like phải nổi lên trên để click được. 
           Class `relative z-10` là bắt buộc ở đây.
        */}
        <div className="relative z-10">
          <ReactionButton post={post} />
        </div>
      </CardFooter>
    </Card>
  );
}

function stripHtml(html?: string) {
  if (!html) return '';
  if (typeof window === 'undefined') return html.replace(/<[^>]*>?/gm, ''); // Server-side fallback
  const doc = new DOMParser().parseFromString(html, 'text/html');
  const text = doc.body.textContent || '';
  return text.length > 150 ? text.substring(0, 150) + '...' : text;
}

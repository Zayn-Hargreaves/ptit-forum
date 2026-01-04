// src/entities/post/ui/post-item.tsx
'use client';

import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import { MessageSquare, Eye } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@shared/ui/avatar/avatar';
import { Badge } from '@shared/ui/badge/badge';
import { Card, CardHeader, CardContent, CardFooter } from '@shared/ui/card/card';
import { ReactionButton } from '@features/reaction/ui/reaction-button';
import type { Post } from '../model/types';

interface PostItemProps {
  post: Post;
}

const formatPostDate = (dateTime: string | undefined) => {
  if (!dateTime) return '';
  const date = new Date(dateTime);
  if (Number.isNaN(date.getTime())) return '';
  return formatDistanceToNow(date, { addSuffix: true, locale: vi });
};

export function PostItem({ post }: Readonly<PostItemProps>) {
  // Defensive checks
  const authorName = post.author?.fullName ?? 'Người dùng ẩn danh';
  const authorAvatar = post.author?.avatarUrl;
  const topicName = post.topic?.name ?? 'General';

  const displayExcerpt = post.excerpt || stripHtml(post.content);

  return (
    <Card className="group relative flex flex-col transition-all duration-200 hover:border-primary/50 hover:shadow-md border-l-4 border-l-transparent hover:border-l-primary">
      <Link href={`/posts/${post.id}`} className="absolute inset-0 z-0" prefetch={false}>
        <span className="sr-only">Xem chi tiết {post.title}</span>
      </Link>

      <CardHeader className="p-6 pb-2 space-y-0">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            {post.author?.id ? (
              <Link href={`/profile/${post.author.id}`} className="relative z-10 transition-opacity hover:opacity-80">
                <Avatar className="h-10 w-10 border bg-muted">
                  <AvatarImage src={authorAvatar} alt={authorName} />
                  <AvatarFallback>{authorName.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
              </Link>
            ) : (
              <span className="relative z-10">
                <Avatar className="h-10 w-10 border bg-muted">
                  <AvatarImage src={authorAvatar} alt={authorName} />
                  <AvatarFallback>{authorName.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
              </span>
            )}

            <div className="flex flex-col min-w-0">
              {post.author?.id ? (
                <Link
                  href={`/profile/${post.author.id}`}
                  className="relative z-10 text-sm font-semibold leading-none hover:underline truncate max-w-[200px]"
                >
                  {authorName}
                </Link>
              ) : (
                <span className="relative z-10 text-sm font-semibold leading-none truncate max-w-[200px]">
                  {authorName}
                </span>
              )}
              <div className="flex items-center gap-2 mt-1.5">
                <span className="text-xs text-muted-foreground whitespace-nowrap" suppressHydrationWarning>
                  {formatPostDate(post.createdDateTime)}
                </span>

                {/* Topic Badge */}
                <Badge
                  variant="secondary"
                  className="relative z-10 text-[10px] font-normal px-1.5 py-0 h-5 hover:bg-secondary/80"
                >
                  {topicName}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>

      {/* ================= CONTENT ================= */}
      <CardContent className="p-6 pt-2 pb-4 flex-1">
        <h3 className="mb-2 text-lg font-bold leading-tight tracking-tight group-hover:text-primary transition-colors line-clamp-2">
          {post.title}
        </h3>

        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">{displayExcerpt}</p>
      </CardContent>

      {/* ================= FOOTER ================= */}
      <CardFooter className="p-6 pt-0 flex items-center justify-between mt-auto">
        {/* Stats Area - Chỉ là thông tin, click xuyên qua vào bài viết */}
        <div className="flex items-center gap-4 text-xs text-muted-foreground font-medium">
          <div className="flex items-center gap-1.5 bg-muted/30 px-2 py-1 rounded-md">
            <Eye className="h-3.5 w-3.5" />
            <span>{post.stats?.viewCount ?? 0}</span>
          </div>
          <div className="flex items-center gap-1.5 bg-muted/30 px-2 py-1 rounded-md">
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
  const doc = new DOMParser().parseFromString(html, 'text/html');
  const text = doc.body.textContent || '';
  return text.length > 150 ? text.substring(0, 150) + '...' : text;
}

'use client';

import { Card, CardHeader, CardContent, CardFooter } from '@shared/ui/card/card';
import { Avatar, AvatarFallback, AvatarImage } from '@shared/ui/avatar/avatar';
import { Button } from '@shared/ui/button/button';
import { MessageSquare, ThumbsUp, Eye, Share2, Clock, AlertCircle, Shield } from 'lucide-react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import { IPost } from '../model/types';
import { PostImageGrid } from './post-image-grid';
import { cn } from '@shared/lib/utils';
import { PostActionMenu } from '@features/post/update-post/ui/post-action-menu';

interface PostCardProps {
  post: IPost;
  topicId: string; // Added for context (Reactions/Comments query key)
}

import { ReactionButton } from '@features/post-reaction/ui/reaction-button';

import { useState } from 'react';
import { stripHtml } from '@shared/lib/html-utils';
import { getUserDisplayName, getUserInitials, getAvatarUrl } from '@shared/lib/user-display-utils';

export function PostCard({ post, topicId }: PostCardProps) {
  const [showComments, setShowComments] = useState(false);
  const likes = post.stats?.likes ?? post.likeCount ?? 0;
  const comments = post.stats?.comments ?? post.commentCount ?? 0;
  const views = post.stats?.views ?? post.viewCount ?? 0;

  // User info with fallbacks
  const authorName = getUserDisplayName(post.author?.fullName);
  const authorAvatar = getAvatarUrl(post.author?.avatar);
  const authorInitials = getUserInitials(post.author?.fullName);
  const authorId = post.author?.id;

  // Ghost Post Pattern: Check if post is pending approval
  const isPending = post.postStatus === 'PENDING';
  const isRejected = post.postStatus === 'REJECTED';

  return (
    <Card className={cn(
      "hover:border-primary/50 transition-all group mb-4",
      // Ghost Post styling for pending posts
      isPending && "border-yellow-400/60 bg-yellow-50/40 opacity-90 shadow-sm",
      // Rejected posts - show with red tint
      isRejected && "border-red-400/60 bg-red-50/30 opacity-85"
    )}>
      <CardHeader className="flex flex-row items-start gap-4 space-y-0 p-4 pb-0">
        {authorId ? (
          <Link href={`/profile/${authorId}`} onClick={(e) => e.stopPropagation()}>
            <Avatar className="h-10 w-10 border cursor-pointer hover:opacity-80 transition-opacity">
              <AvatarImage src={authorAvatar} alt={authorName} />
              <AvatarFallback>{authorInitials}</AvatarFallback>
            </Avatar>
          </Link>
        ) : (
          <Avatar className="h-10 w-10 border">
            <AvatarImage src={authorAvatar} />
            <AvatarFallback>{authorInitials}</AvatarFallback>
          </Avatar>
        )}
        <div className="flex-1 space-y-0.5">
          {authorId ? (
            <Link href={`/profile/${authorId}`} className="font-semibold text-sm hover:underline" onClick={(e) => e.stopPropagation()}>
              {authorName}
            </Link>
          ) : (
            <span className="font-semibold text-sm">{authorName}</span>
          )}
          <p className="text-xs text-muted-foreground">
            {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true, locale: vi })}
          </p>
        </div>

        {/* Status Badge & Action Menu */}
        <div className="flex items-center gap-2">
          {/* Status Badge for Pending/Rejected */}
          {isPending && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-yellow-100 border border-yellow-200 rounded-md">
              <Clock className="w-3.5 h-3.5 text-yellow-700" />
              <span className="text-xs font-medium text-yellow-800">Chờ duyệt</span>
            </div>
          )}
          {isRejected && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-red-100 border border-red-200 rounded-md">
              <Shield className="w-3.5 h-3.5 text-red-700" />
              <span className="text-xs font-medium text-red-800">Đã từ chối</span>
            </div>
          )}
          
          {/* Action Menu (3 dots) */}
          <PostActionMenu post={post} />
        </div>
      </CardHeader>
      
      <CardContent className="p-4 pt-3 pb-2">
        <Link href={`/forum/post/${post.id}`} className="block">
          <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors line-clamp-2">
            {post.title}
          </h3>
          <p className="text-muted-foreground text-sm line-clamp-3 leading-relaxed">
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
          <div className="mt-3 flex items-start gap-2 text-xs text-yellow-800 bg-yellow-100/60 p-2.5 rounded-md border border-yellow-200/50">
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="font-medium mb-0.5">Bài viết đang chờ phê duyệt</p>
              <p className="text-yellow-700/90">
                Bài viết này chỉ hiển thị với bạn và quản trị viên. Sau khi được duyệt, bài sẽ hiển thị công khai cho tất cả thành viên.
              </p>
            </div>
          </div>
        )}

        {isRejected && (
          <div className="mt-3 flex items-start gap-2 text-xs text-red-800 bg-red-100/60 p-2.5 rounded-md border border-red-200/50">
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="font-medium mb-0.5">Bài viết bị từ chối</p>
              <p className="text-red-700/90">
                Bài viết này không được phê duyệt bởi quản trị viên và chỉ hiển thị với bạn.
              </p>
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="p-2 px-4 flex justify-between border-t bg-muted/5">
        <div className="flex gap-1">
             <ReactionButton 
                topicId={topicId} 
                postId={post.id} 
                initialLikeCount={likes} 
                initialIsLiked={post.isLiked} 
             />
             <Link 
                href={`/forum/post/${post.id}`} 
                className="inline-flex items-center justify-center h-8 gap-2 px-2 text-muted-foreground hover:text-blue-500 hover:bg-blue-50 rounded-md text-xs font-medium transition-colors"
             >
                <MessageSquare className="w-4 h-4" />
                <span>{comments} bình luận</span>
             </Link>
        </div>
        
        <div className="flex gap-2 text-muted-foreground text-xs items-center">
            <span className="flex items-center gap-1">
                <Eye className="w-3.5 h-3.5" /> {views}
            </span>
             <Button variant="ghost" size="icon" className="h-8 w-8 ml-1">
                <Share2 className="w-4 h-4" />
             </Button>
        </div>
      </CardFooter>
    </Card>
  );
}

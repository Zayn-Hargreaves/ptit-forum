'use client';

import { useQuery } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import { postApi } from '@entities/post/api/post-api';
import { Button } from '@shared/ui/button/button';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@shared/ui/avatar/avatar';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import { CommentSection } from '@features/post-comment/ui/comment-section';
import { ReactionButton } from '@features/post-reaction/ui/reaction-button';
import { PostImageGrid } from '@entities/post/ui/post-image-grid';
import { FileDownloadButton } from '@shared/ui/file-download-button';
import { getUserDisplayName, getUserInitials, getAvatarUrl } from '@shared/lib/user-display-utils';
import { PostActionMenu } from '@features/post/update-post/ui/post-action-menu';

export default function PostDetailPage() {
  const { postId } = useParams<{ postId: string }>();
  const router = useRouter();

  const { data: post, isLoading, isError } = useQuery({
    queryKey: ['post', postId],
    queryFn: () => postApi.getPostDetail(postId),
    enabled: !!postId,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isError || !post) {
     return (
        <div className="text-center py-20 space-y-4">
           <h2 className="text-xl font-semibold">Không tìm thấy bài viết</h2>
           <Button variant="outline" onClick={() => router.back()}>Quay lại</Button>
        </div>
     );
  }

  // User info with fallbacks
  const authorName = getUserDisplayName(post.author?.fullName);
  const authorAvatar = getAvatarUrl(post.author?.avatar);
  const authorInitials = getUserInitials(post.author?.fullName);

  return (
    <div className="max-w-4xl mx-auto py-6 px-4">
       <Button 
          variant="ghost" 
          className="mb-4 pl-0 hover:pl-2 transition-all gap-2" 
          onClick={() => router.back()}
       >
          <ArrowLeft className="h-4 w-4" /> 
          Quay lại
       </Button>

       <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
          {/* Header */}
          <div className="p-6 border-b">
             <h1 className="text-2xl font-bold mb-4">{post.title}</h1>
             <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 border">
                     <AvatarImage src={authorAvatar} />
                     <AvatarFallback>{authorInitials}</AvatarFallback>
                  </Avatar>
                  <div>
                     <div className="font-semibold">{authorName}</div>
                     <div className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true, locale: vi })}
                     </div>
                  </div>
                </div>
                
                {/* Action Menu (3 dots) */}
                <PostActionMenu post={post} isDetailView={true} />
             </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
             {/* Text Content */}
             <div 
               className="prose dark:prose-invert max-w-none text-foreground leading-relaxed"
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
                   <h3 className="font-semibold text-sm text-foreground/80">Tài liệu đính kèm ({post.documents.length})</h3>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {post.documents.map((doc, idx) => (
                         <div key={idx} className="flex items-center justify-between p-3 rounded-lg border bg-muted/30 hover:bg-muted/50 transition-colors">
                            <div className="flex items-center gap-3 truncate">
                               <div className="h-8 w-8 rounded bg-primary/10 flex items-center justify-center text-primary font-bold text-xs uppercase shrink-0">
                                  {doc.name.split('.').pop() || 'FILE'}
                               </div>
                               <span className="text-sm font-medium truncate" title={doc.name}>{doc.name}</span>
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
          <div className="p-4 bg-muted/5 border-t border-b flex items-center justify-between">
             <ReactionButton 
                postId={post.id} 
                initialLikeCount={post.likeCount} 
                initialIsLiked={post.isLiked} 
                queryKey={['post', post.id]} // Direct update to this query
             />
             <div className="text-sm text-muted-foreground">
                {post.viewCount} lượt xem
             </div>
          </div>
          
          {/* Comments Section - Reuse existing component */}
          <div className="bg-muted/10 p-0">
              <CommentSection postId={post.id} />
          </div>
       </div>
    </div>
  );
}

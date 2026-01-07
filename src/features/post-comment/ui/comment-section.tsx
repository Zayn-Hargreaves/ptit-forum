'use client';

import { useQuery } from '@tanstack/react-query';
import { commentApi } from '../api/comment-api';
import { CommentItem } from './comment-item';
import { CommentInput } from './comment-input';
import { Skeleton } from '@shared/ui/skeleton/skeleton';
import { useState } from 'react';

interface CommentSectionProps {
  postId: string;
}

export function CommentSection({ postId }: CommentSectionProps) {
  const [replyingToId, setReplyingToId] = useState<string | null>(null);

  const { data: comments, isLoading, isError } = useQuery({
    queryKey: ['comments', postId],
    queryFn: () => commentApi.getComments(postId),
  });

  // Debug logs
  if (comments && comments.length > 0) {
      console.log('DEBUG: Comments loaded:', comments.length);
      const roots = comments.filter(c => !c.parentId);
      console.log('DEBUG: Roots found:', roots.length, roots.map(r => r.id));
      const testRoot = comments.find(c => c.content.includes('test') && !c.content.includes('test 2'));
      console.log('DEBUG: "test" root found?', testRoot);
  }

  return (
    <div className="flex flex-col bg-muted/5">
       {/* Comments List */}
       <div className="px-4 py-2 space-y-6">
           {isLoading && (
               <div className="space-y-3 py-2">
                   <div className="flex gap-3">
                       <Skeleton className="h-8 w-8 rounded-full" />
                       <Skeleton className="h-10 w-2/3 rounded-xl" />
                   </div>
                   <div className="flex gap-3">
                       <Skeleton className="h-8 w-8 rounded-full" />
                       <Skeleton className="h-10 w-1/2 rounded-xl" />
                   </div>
               </div>
           )}

           {isError && <div className="text-xs text-red-500 py-2">Không thể tải bình luận</div>}
           
           {comments && comments.length > 0 && (
               <div className="space-y-6 py-2">
                   {comments
                    .filter(c => !c.parentId) // Root comments
                    .map(rootComment => {
                        // FIX: Flatten nested replies (grandchildren) to display under Root
                        const replies = comments.filter(c => {
                            // 1. Direct reply to root
                            if (c.parentId === rootComment.id) return true;
                            
                            // 2. Reply to a child of root (Grandchild)
                            const parent = comments.find(p => p.id === c.parentId);
                            return parent?.parentId === rootComment.id;
                        });
                        
                        return (
                            <div key={rootComment.id} className="space-y-2">
                                {/* Root Comment */}
                                <CommentItem 
                                    comment={rootComment} 
                                    postId={postId}
                                    replyingToId={replyingToId}
                                    onReply={setReplyingToId}
                                />
                                
                                {/* Replies Container */}
                                {replies.length > 0 && (
                                    <div className="ml-11 space-y-3 pl-3 border-l-2 border-muted">
                                        {replies.map(reply => (
                                            <CommentItem 
                                                key={reply.id} 
                                                comment={reply}
                                                postId={postId}
                                                replyingToId={replyingToId}
                                                onReply={setReplyingToId}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })}
               </div>
           )}
           
           {comments && comments.length === 0 && !isLoading && (
               <div className="text-center text-xs text-muted-foreground py-4 italic">
                   Chưa có bình luận nào.
               </div>
           )}
       </div>

       {/* Input */}
       <CommentInput postId={postId} />
    </div>
  );
}

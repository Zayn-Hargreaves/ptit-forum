'use client';

import { useState } from 'react';
import { useCreateComment } from '../model/use-comment-mutations';
import { Avatar, AvatarFallback } from '@shared/ui/avatar/avatar';
import { Button } from '@shared/ui/button/button';
import { SendHorizontal, Loader2, X } from 'lucide-react';
import { commentApi } from '../api/comment-api';
import { LiteEditor } from '@shared/ui/editor/lite-editor';
import { toast } from 'sonner';

interface CommentInputProps {
  postId: string;
  parentId?: string; // Optional for replies
  initialContent?: string;
  onCancel?: () => void;
  autoFocus?: boolean;
}

export function CommentInput({ postId, parentId, initialContent = '', onCancel, autoFocus }: CommentInputProps) {
  const [content, setContent] = useState(initialContent);


  const { mutate, isPending } = useCreateComment({
    postId,
    onSuccess: () => {
      setContent('');
      if (onCancel) onCancel();
    } 
  });

  const handleSubmit = () => {
    // Basic check for empty HTML content (e.g. <p></p>)
    const stripped = content.replace(/<[^>]*>?/gm, '').trim();
    if (!stripped) return;
    mutate({ content, parentId });
  };

  return (
    <div className="flex gap-3 items-start p-4 border-t">
      <Avatar className="h-8 w-8 mt-1">
        <AvatarFallback>ME</AvatarFallback>
      </Avatar>
      
      <div className="flex-1 space-y-2">
         <LiteEditor
            value={content}
            onChange={setContent}
            placeholder={parentId ? "Viết phản hồi... " : "Viết bình luận... (Ctrl+Enter để gửi)"}
            disabled={isPending}
            onSubmit={handleSubmit}
            // Note: LiteEditor might need autoFocus prop support or we use ref in useEffect in parent
         />
         
         <div className="flex justify-end gap-2">
             {onCancel && (
                 <Button variant="ghost" size="sm" onClick={onCancel}>
                     Hủy
                 </Button>
             )}
             <Button 
                size="sm" 
                onClick={handleSubmit}
                disabled={!content.replace(/<[^>]*>?/gm, '').trim() || isPending}
             >
                {isPending ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Đang gửi
                    </>
                ) : (
                    <>
                        <SendHorizontal className="mr-2 h-4 w-4" />
                        {parentId ? "Phản hồi" : "Bình luận"}
                    </>
                )}
             </Button>
         </div>
      </div>
    </div>
  );
}

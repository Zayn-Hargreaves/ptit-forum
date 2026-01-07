'use client';

import { Button } from '@shared/ui/button/button';
import { Heart } from 'lucide-react';
import { useReaction } from '../model/use-reaction';
import { TargetType } from '@entities/interaction/model/types';
import { cn } from '@shared/lib/utils';
import { useState } from 'react';

interface ReactionButtonProps {
  topicId?: string; // Optional if queryKey is provided
  postId: string;
  initialLikeCount: number;
  initialIsLiked?: boolean;
  queryKey?: any[]; // Allow overriding queryKey
}

export function ReactionButton({ topicId, postId, initialLikeCount, initialIsLiked, queryKey }: ReactionButtonProps) {
  const { mutate } = useReaction({
      targetId: postId,
      targetType: TargetType.POST,
      currentIsLiked: initialIsLiked || false,
      currentCount: initialLikeCount,
      queryKey: queryKey || ['posts', topicId]
  });
  
  // Local state for animation purposes (logic is handled by RQ cache primarily, but this helps with immediate visual feedback if needed independently, though props driven is better)
  // Actually, since we are using optimistic updates via RQ, the props passed from the parent (PostCard) which reads from cache *should* update immediately.
  // So we just rely on props being fresh.
  
  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    mutate();
  };

  return (
    <Button 
        variant="ghost" 
        size="sm" 
        className={cn(
            "gap-1 px-2 h-8 hover:bg-red-50 hover:text-red-500 transition-all active:scale-95 group",
            initialIsLiked && "text-red-500"
        )}
        onClick={handleLike}
    >
      <Heart 
        className={cn(
            "w-4 h-4 transition-transform duration-200 group-hover:scale-110", 
            initialIsLiked ? "fill-current scale-110" : ""
        )} 
      />
      <span className="text-xs font-medium tabular-nums">{initialLikeCount}</span>
    </Button>
  );
}

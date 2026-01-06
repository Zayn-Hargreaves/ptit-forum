'use client';

import { Post } from '@entities/post/model/types';
import { cn } from '@shared/lib/utils';
import { Button } from '@shared/ui/button/button';
import { Heart } from 'lucide-react';
import { useDebouncedCallback } from 'use-debounce';

import { usePostReaction } from '../hooks/use-post-reaction';

interface ReactionButtonProps {
  post: Post;
  className?: string;
}

export function ReactionButton({ post, className }: Readonly<ReactionButtonProps>) {
  const { mutate: toggleReaction } = usePostReaction({ post });

  const handleToggle = useDebouncedCallback(
    () => {
      toggleReaction('LIKE');
    },
    500,
    { leading: false, trailing: true },
  );

  const isLiked = Boolean(post.isLiked);
  const count = post.stats?.likeCount ?? 0;

  return (
    <Button
      variant="ghost"
      size="sm"
      aria-label={isLiked ? `Unlike (${count} reactions)` : `Like (${count} reactions)`}
      className={cn(
        'group gap-2 transition-colors hover:text-red-500',
        isLiked && 'text-red-500',
        className,
      )}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        handleToggle();
      }}
    >
      <Heart
        className={cn(
          'h-5 w-5 transition-all duration-300',
          isLiked ? 'scale-110 fill-current' : 'group-hover:scale-110',
        )}
      />
      <span>{count}</span>
    </Button>
  );
}

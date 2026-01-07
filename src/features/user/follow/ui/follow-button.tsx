import { Button } from '@shared/ui/button/button';
import { UserProfile } from '@entities/session/model/types';
import { useFollow } from '@features/user/follow/model/use-follow';
import { Loader2, UserMinus, UserPlus } from 'lucide-react';

interface FollowButtonProps {
  user: UserProfile;
  className?: string; // Allow minimal styling injection
}

export function FollowButton({ user, className }: Readonly<FollowButtonProps>) {
  const { follow, unfollow } = useFollow(user.id);

  if (user.isOwnProfile) {
    return null;
  }

  // We rely on user.isFollowing being present (optimistically updated or from server)
  const isFollowing = user.isFollowing ?? false;
  const isPending = follow.isPending || unfollow.isPending;

  const handleFollowClick = () => {
    if (isFollowing) {
      unfollow.mutate();
    } else {
      follow.mutate();
    }
  };

  let icon;
  if (isPending) {
    icon = <Loader2 className="mr-2 h-4 w-4 animate-spin" />;
  } else if (isFollowing) {
    icon = <UserMinus className="mr-2 h-4 w-4" />;
  } else {
    icon = <UserPlus className="mr-2 h-4 w-4" />;
  }

  return (
    <Button
      variant={isFollowing ? 'outline' : 'default'}
      onClick={handleFollowClick}
      disabled={isPending}
      className={className}
    >
      {icon}
      {isFollowing ? 'Đang theo dõi' : 'Theo dõi'}
    </Button>
  );
}

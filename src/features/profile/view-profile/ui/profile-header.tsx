import { UserProfile } from '@entities/session/model/types';
import { useUserStats } from '@features/profile/api/use-user-stats';
import { FollowButton } from '@features/user/follow/ui/follow-button';
import { Avatar, AvatarFallback, AvatarImage } from '@shared/ui/avatar/avatar';
import { Button } from '@shared/ui/button/button';
import {
  Calendar,
  Edit,
  Files,
  FileText,
  Link as LinkIcon,
  MapPin,
  Shield,
} from 'lucide-react';
import Link from 'next/link';

interface ProfileHeaderProps {
  user: UserProfile;
  isOwnProfile: boolean;
}

export function ProfileHeader({ user, isOwnProfile }: Readonly<ProfileHeaderProps>) {
  const { data: stats } = useUserStats(user.id);
  
  let bioContent;
  if (user.bio) {
    bioContent = <p className="text-muted-foreground text-sm leading-relaxed">{user.bio}</p>;
  } else if (isOwnProfile) {
    bioContent = (
      <div className="rounded-lg border border-amber-200 bg-amber-50/50 p-4">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 rounded-full bg-amber-100 p-1">
            <Shield className="h-3.5 w-3.5 text-amber-600" />
          </div>
          <div>
            <h4 className="text-sm font-medium text-amber-900">Profile Incomplete</h4>
            <p className="mt-1 text-sm text-amber-700/80">
              You haven&apos;t added a bio yet.{' '}
              <Link
                href="/settings/profile"
                className="font-semibold underline hover:text-amber-900"
              >
                Add one now
              </Link>{' '}
              to let people know who you are.
            </p>
          </div>
        </div>
      </div>
    );
  } else {
    bioContent = (
      <p className="text-muted-foreground text-sm leading-relaxed italic">
        This user prefers to keep an air of mystery about them.
      </p>
    );
  }
  return (
    <div className="bg-card ring-border/50 relative mb-8 rounded-2xl pb-6 shadow-sm ring-1">
      {/* 1. Banner - Tối ưu chiều cao, dùng Gradient sang trọng hơn */}
      <div className="relative h-40 w-full overflow-hidden rounded-t-2xl bg-linear-to-br from-indigo-900 via-slate-800 to-slate-900">
        {/* Pattern overlay for texture (optional) */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150"></div>
      </div>

      <div className="px-6">
        <div className="relative flex flex-col items-start gap-6 md:flex-row md:items-end">
          {/* 2. Avatar "Pop" - Tăng border để tách nền */}
          <div className="relative z-10 -mt-16">
            <div className="bg-card rounded-full p-1.5 shadow-sm">
              <Avatar className="border-card h-32 w-32 rounded-full border-4 shadow-md">
                <AvatarImage
                  src={user.avatarUrl || 'https://github.com/shadcn.png'}
                  className="object-cover"
                />
                <AvatarFallback className="text-muted-foreground text-4xl font-bold">
                  {user.fullName.charAt(0)}
                </AvatarFallback>
              </Avatar>
            </div>
            {/* Online Status Indicator */}
            <div className="border-card absolute right-4 bottom-4 h-5 w-5 rounded-full border-[3px] bg-emerald-500 shadow-sm" />
          </div>

          {/* 3. Info Group - Gom cụm Tên + Bio + Actions */}
          <div className="min-w-0 flex-1 pt-2 md:pb-2">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              {/* User Identity */}
              <div>
                <h1 className="text-card-foreground text-2xl leading-tight font-bold tracking-tight md:text-3xl">
                  {user.fullName}
                </h1>
                <div className="text-muted-foreground mt-1 flex items-center gap-2 text-sm">
                  {/* facultyName removed as it is not in backend response */}
                  <span className="text-xs">User/Student</span>
                </div>
              </div>

              {/* Actions - Nút bấm rõ ràng */}
              <div className="flex items-center gap-2">
                {isOwnProfile ? (
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="hover:bg-secondary/80 h-9 px-4 font-medium shadow-sm"
                  >
                    <Link href="/settings/profile">
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Profile
                    </Link>
                  </Button>
                ) : (
                  <>
                    <FollowButton user={user} />
                    <Button variant="outline" size="sm" className="h-9 font-medium shadow-sm">
                      Message
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 4. Layout 2 Cột: Main & Sidebar Stats */}
        <div className="mt-8 grid gap-8 lg:grid-cols-3">
          {/* Left Column: Bio & Details */}
          <div className="space-y-6 lg:col-span-2">
            {/* Bio Section */}
            <div>
              <h3 className="text-foreground mb-2 text-sm font-semibold tracking-wider uppercase">
                About
              </h3>
              {bioContent}
            </div>

            {/* Details Grid - Icon visual */}
            <div className="text-muted-foreground flex flex-wrap gap-x-6 gap-y-2 text-sm">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 opacity-70" />
                <span>Hanoi, Vietnam</span>
              </div>
              <div className="flex items-center gap-2">
                <LinkIcon className="h-4 w-4 opacity-70" />
                <Link href="#" className="hover:text-primary hover:underline">
                  ptit.edu.vn
                </Link>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 opacity-70" />
                <span>Joined recently</span>
              </div>
            </div>
          </div>

          {/* Right Column: Stats Card - "Bold" numbers */}
          <div className="bg-card/50 rounded-xl border p-5 shadow-sm">
            <div className="grid grid-cols-2 gap-4">
              <StatItem
                icon={<FileText className="h-5 w-5 text-blue-500" />}
                label="Posts"
                value={stats?.postCount || 0}
              />
              <StatItem
                icon={<Files className="h-5 w-5 text-indigo-500" />}
                label="Docs"
                value={stats?.documentCount || 0}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper Component for Stats
function StatItem({
  icon,
  label,
  value,
}: Readonly<{ icon: React.ReactNode; label: string; value: number }>) {
  return (
    <div className="bg-background ring-border/50 hover:bg-accent/50 flex flex-col items-center justify-center rounded-lg p-3 text-center ring-1 transition-all">
      <div className="bg-accent/50 mb-2 rounded-full p-2">{icon}</div>
      <span className="text-foreground text-2xl font-bold tracking-tight">{value}</span>
      <span className="text-muted-foreground text-xs font-medium uppercase">{label}</span>
    </div>
  );
}

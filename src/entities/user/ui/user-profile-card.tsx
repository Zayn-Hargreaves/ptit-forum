import { UserProfile } from '@entities/session/model/types';
import { Button, Card, CardContent } from '@shared/ui';
import { UserAvatar } from '@shared/ui/user-avatar/user-avatar';
import { GraduationCap, Settings } from 'lucide-react';
import Link from 'next/link';

interface UserProfileCardProps {
  user: UserProfile;
  isOwnProfile?: boolean;
}

export function UserProfileCard({ user, isOwnProfile = false }: Readonly<UserProfileCardProps>) {
  const displayName = user.fullName || user.email;

  return (
    <Card className="bg-muted/30 mb-6 border-none shadow-sm">
      <CardContent className="p-6">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div className="flex items-center gap-6 md:items-start">
            <UserAvatar
              name={displayName}
              avatarUrl={user.avatarUrl}
              className="border-background h-20 w-20 border-2 text-2xl shadow-md md:h-24 md:w-24"
            />

            <div className="flex-1 space-y-2">
              <div>
                <h1 className="text-foreground text-2xl font-bold">{displayName}</h1>
                <p className="text-muted-foreground text-sm">{user.email}</p>
              </div>

              <div className="text-muted-foreground flex flex-wrap gap-x-6 gap-y-2 text-sm">
                {user.studentCode && (
                  <div className="flex items-center gap-1.5">
                    <span className="text-foreground font-medium">MSSV:</span>
                    {user.studentCode}
                  </div>
                )}

                {(user.facultyName || user.classCode) && (
                  <div className="flex items-center gap-1.5">
                    <GraduationCap className="h-4 w-4" />
                    <span>
                      {user.facultyName} {user.classCode ? `• ${user.classCode}` : ''}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {isOwnProfile && (
            <Button variant="outline" size="sm" asChild className="shrink-0">
              <Link href="/settings/profile">
                <Settings className="mr-2 h-4 w-4" />
                Sửa hồ sơ
              </Link>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

import { User } from "@entities/session/model/types";
import { formatDate } from "@shared/lib/utils";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  Card,
  CardContent,
} from "@shared/ui";
import { Settings, MapPin, Building, GraduationCap } from "lucide-react";
import Link from "next/link";

interface UserProfileCardProps {
  user: User;
  isOwnProfile?: boolean;
}

export function UserProfileCard({
  user,
  isOwnProfile = false,
}: UserProfileCardProps) {
  const displayName = user.fullName || user.email;
  const initial = displayName[0]?.toUpperCase() || "U";

  return (
    <Card className="mb-6 border-none shadow-sm bg-muted/30">
      <CardContent className="p-6">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div className="flex gap-6 items-center md:items-start">
            <Avatar className="h-20 w-20 md:h-24 md:w-24 border-2 border-background shadow-md">
              <AvatarImage
                src={user.avatarUrl || "/placeholder.svg"}
                alt={displayName}
              />
              <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                {initial}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 space-y-2">
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  {displayName}
                </h1>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>

              <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
                {user.studentId && (
                  <div className="flex items-center gap-1.5">
                    <span className="font-medium text-foreground">MSSV:</span>
                    {user.studentId}
                  </div>
                )}

                {(user.faculty || user.className) && (
                  <div className="flex items-center gap-1.5">
                    <GraduationCap className="h-4 w-4" />
                    <span>
                      {user.faculty}{" "}
                      {user.className ? `• ${user.className}` : ""}
                    </span>
                  </div>
                )}

                <div className="flex items-center gap-1.5">
                  <span className="text-xs">
                    Tham gia: {formatDate(user.createdAt)}
                  </span>
                </div>
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

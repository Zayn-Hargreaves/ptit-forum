import { User } from "@entities/session/model/types";
import { Card, CardContent } from "@shared/ui/card/card";
import { UserAvatar } from "@shared/ui/user-avatar/user-avatar";
import { Button } from "@shared/ui/button/button";
import { Settings, Award, TrendingUp } from "lucide-react";
import Link from "next/link";
import { formatDate } from "@shared/lib/utils";

interface ProfileHeaderProps {
  user: User;
  isOwnProfile?: boolean;
}

export function ProfileHeader({
  user,
  isOwnProfile,
}: Readonly<ProfileHeaderProps>) {
  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div className="flex gap-6">
            <UserAvatar
              name={user.fullName}
              avatarUrl={user.avatarUrl}
              className="h-24 w-24 text-3xl"
            />

            <div className="flex-1">
              <div className="mb-2 flex items-center gap-3">
                <h1 className="text-2xl font-bold">{user.fullName}</h1>
                <div className="flex items-center gap-1 bg-primary/10 text-primary px-2 py-0.5 rounded-full text-xs font-medium">
                  <Award className="h-3 w-3" />
                  Level 1 {/* Hardcode tạm hoặc thêm field level vào DB */}
                </div>
              </div>

              <div className="mb-4 space-y-1 text-sm text-muted-foreground">
                <p>{user.email}</p>
                <p>
                  MSSV: {user.studentCode || "Chưa cập nhật"} •{" "}
                  {user.facultyName || "Chưa cập nhật"}
                </p>
                <p>Lớp: {user.classCode || "Chưa cập nhật"}</p>
                {/* <p>Tham gia từ {formatDate(user.createdAt)}</p> */}
              </div>
            </div>
          </div>

          {isOwnProfile && (
            <Button asChild variant="outline">
              <Link href="/settings">
                <Settings className="mr-2 h-4 w-4" />
                Chỉnh sửa
              </Link>
            </Button>
          )}
        </div>

        {/* Stats Section - Hardcode tạm vì chưa có API stats */}
        <div className="mt-6 grid grid-cols-4 gap-4 border-t pt-6">
          {/* ... Giữ nguyên code HTML stats của cậu ... */}
        </div>
      </CardContent>
    </Card>
  );
}

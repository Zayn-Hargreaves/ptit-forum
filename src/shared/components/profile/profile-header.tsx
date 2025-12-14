import { Avatar, AvatarFallback, AvatarImage } from "@shared/ui/avatar/avatar";
import { Badge } from "@shared/ui/badge/badge";
import { Button } from "@shared/ui/button/button";
import { Card, CardContent } from "@shared/ui/card/card";
import { Settings, Award, TrendingUp } from "lucide-react";
import Link from "next/link";

export function ProfileHeader() {
  const user = {
    name: "Nguyễn Văn A",
    email: "nguyenvana@student.ptit.edu.vn",
    studentId: "B21DCCN001",
    faculty: "Công nghệ thông tin",
    class: "D21CQCN01-B",
    level: 5,
    reputation: 1250,
    joinDate: "Tháng 9, 2021",
  };

  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div className="flex gap-6">
            <Avatar className="h-24 w-24">
              <AvatarImage src="/placeholder.svg" />
              <AvatarFallback className="text-2xl">
                {user.name[0]}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <div className="mb-2 flex items-center gap-3">
                <h1 className="text-2xl font-bold">{user.name}</h1>
                <Badge variant="default" className="gap-1">
                  <Award className="h-3 w-3" />
                  Level {user.level}
                </Badge>
              </div>

              <div className="mb-4 space-y-1 text-sm text-muted-foreground">
                <p>{user.email}</p>
                <p>
                  MSSV: {user.studentId} • {user.faculty}
                </p>
                <p>Lớp: {user.class}</p>
                <p>Tham gia từ {user.joinDate}</p>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  <span className="text-sm font-semibold">
                    {user.reputation} điểm danh tiếng
                  </span>
                </div>
              </div>
            </div>
          </div>

          <Button asChild>
            <Link href="/settings">
              <Settings className="mr-2 h-4 w-4" />
              Chỉnh sửa hồ sơ
            </Link>
          </Button>
        </div>

        <div className="mt-6 grid grid-cols-4 gap-4 border-t pt-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">156</div>
            <div className="text-sm text-muted-foreground">Bài viết</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">423</div>
            <div className="text-sm text-muted-foreground">Bình luận</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">12</div>
            <div className="text-sm text-muted-foreground">Tài liệu</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">8</div>
            <div className="text-sm text-muted-foreground">Sự kiện</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

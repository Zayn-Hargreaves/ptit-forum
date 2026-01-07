import { Avatar, AvatarFallback } from "@shared/ui/avatar/avatar";
import { Badge } from "@shared/ui/badge/badge";
import { Button } from "@shared/ui/button/button";
import { Card, CardContent, CardHeader, CardTitle } from "@shared/ui/card/card";
import { Separator } from "@shared/ui/separator/separator";
import { Download, Bookmark, Share2, Flag } from "lucide-react";

export function DocumentInfo({ documentId }: { documentId: string }) {
  // Mock data
  const document = {
    title: "Slide bài giảng Lập trình hướng đối tượng - Chương 1",
    description:
      "Slide bài giảng chi tiết về các khái niệm cơ bản của lập trình hướng đối tượng, bao gồm class, object, inheritance, polymorphism.",
    subject: "OOP",
    type: "Slide",
    semester: "Kỳ 3",
    uploader: "Nguyễn Văn A",
    uploaderLevel: 5,
    uploadDate: "2 ngày trước",
    downloads: 234,
    views: 567,
    fileType: "PDF",
    fileSize: "2.5 MB",
    tags: ["oop", "java", "lập-trình"],
  };

  return (
    <div className="space-y-6">
      {/* Main Info Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{document.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            {document.description}
          </p>

          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">{document.subject}</Badge>
            <Badge variant="outline">{document.type}</Badge>
            <Badge variant="outline">{document.semester}</Badge>
          </div>

          <Separator />

          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Loại file:</span>
              <span className="font-medium">{document.fileType}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Kích thước:</span>
              <span className="font-medium">{document.fileSize}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Lượt tải:</span>
              <span className="font-medium">{document.downloads}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Lượt xem:</span>
              <span className="font-medium">{document.views}</span>
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <Button className="w-full" size="lg">
              <Download className="mr-2 h-4 w-4" />
              Tải về
            </Button>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" size="sm">
                <Bookmark className="mr-2 h-4 w-4" />
                Lưu
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="mr-2 h-4 w-4" />
                Chia sẻ
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Uploader Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Người tải lên</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarFallback>{document.uploader[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-semibold">{document.uploader}</span>
                <Badge variant="secondary" className="text-xs">
                  Level {document.uploaderLevel}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {document.uploadDate}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tags */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Tags</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {document.tags.map((tag) => (
              <Badge key={tag} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Report */}
      <Button
        variant="ghost"
        size="sm"
        className="w-full text-muted-foreground"
      >
        <Flag className="mr-2 h-4 w-4" />
        Báo cáo tài liệu
      </Button>
    </div>
  );
}

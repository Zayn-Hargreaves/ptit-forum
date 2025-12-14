"use client";

import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { AvatarFallback } from "@shared/ui/avatar/avatar";
import { Badge } from "@shared/ui/badge/badge";
import { Button } from "@shared/ui/button/button";
import { Card, CardContent, CardHeader } from "@shared/ui/card/card";
import { Separator } from "@shared/ui/separator/separator";
import {
  Calendar,
  Eye,
  Pin,
  Download,
  FileText,
  Share2,
  Bookmark,
  ChevronLeft,
} from "lucide-react";
import Link from "next/link";

// Mock data - trong thực tế sẽ fetch từ API
const announcementData: Record<string, any> = {
  "1": {
    id: 1,
    title: "Thông báo lịch thi giữa kỳ học kỳ 1 năm học 2024-2025",
    category: "Học vụ",
    author: "Phòng Đào tạo",
    authorAvatar: "/diverse-classroom-teacher.png",
    date: "2024-11-10",
    isPinned: true,
    views: 1234,
    content: `
      <h2>Kính gửi: Toàn thể sinh viên các khóa</h2>
      
      <p>Phòng Đào tạo thông báo lịch thi giữa kỳ các môn học trong học kỳ 1 năm học 2024-2025 như sau:</p>
      
      <h3>I. THỜI GIAN THI</h3>
      <p>Thời gian thi: Từ ngày 25/11/2024 đến ngày 30/11/2024</p>
      <p>Các ca thi:</p>
      <ul>
        <li>Ca 1: 7h00 - 8h30</li>
        <li>Ca 2: 9h00 - 10h30</li>
        <li>Ca 3: 13h00 - 14h30</li>
        <li>Ca 4: 15h00 - 16h30</li>
      </ul>
      
      <h3>II. ĐỊA ĐIỂM THI</h3>
      <p>Sinh viên xem phòng thi cụ thể trong file đính kèm hoặc tra cứu trên hệ thống.</p>
      
      <h3>III. QUY ĐỊNH VỀ THI</h3>
      <ol>
        <li>Sinh viên phải có mặt trước giờ thi 15 phút để làm thủ tục dự thi</li>
        <li>Mang theo thẻ sinh viên và giấy tờ tùy thân có ảnh</li>
        <li>Không được mang tài liệu, điện thoại di động vào phòng thi</li>
        <li>Sinh viên vi phạm quy chế thi sẽ bị xử lý theo quy định</li>
      </ol>
      
      <h3>IV. LƯU Ý</h3>
      <p>Sinh viên cần theo dõi thông báo trên website và email để cập nhật thông tin mới nhất về lịch thi.</p>
      <p>Mọi thắc mắc xin liên hệ Phòng Đào tạo qua email: daotao@ptit.edu.vn hoặc số điện thoại: 024.1234.5678</p>
      
      <p style="margin-top: 2rem;"><strong>Trân trọng!</strong></p>
    `,
    attachments: [
      {
        id: 1,
        name: "Lich_thi_giua_ky_HK1_2024-2025.pdf",
        size: "2.4 MB",
        type: "PDF",
      },
      {
        id: 2,
        name: "Danh_sach_phong_thi.xlsx",
        size: "156 KB",
        type: "Excel",
      },
    ],
  },
  "2": {
    id: 2,
    title: "Thông báo về học bổng khuyến khích học tập kỳ 1/2024",
    category: "Học bổng",
    author: "Phòng CTSV",
    authorAvatar: "/admin-interface.png",
    date: "2024-11-08",
    isPinned: true,
    views: 892,
    content: `
      <h2>Kính gửi: Sinh viên được đề xuất nhận học bổng</h2>
      
      <p>Phòng Công tác sinh viên thông báo danh sách sinh viên đạt học bổng khuyến khích học tập học kỳ 1 năm học 2024 như sau:</p>
      
      <h3>I. DANH SÁCH SINH VIÊN NHẬN HỌC BỔNG</h3>
      <p>Danh sách chi tiết xem trong file đính kèm.</p>
      
      <h3>II. MỨC HỌC BỔNG</h3>
      <ul>
        <li>Học bổng loại A (GPA ≥ 3.6): 2.000.000 VNĐ</li>
        <li>Học bổng loại B (3.2 ≤ GPA < 3.6): 1.500.000 VNĐ</li>
        <li>Học bổng loại C (2.8 ≤ GPA < 3.2): 1.000.000 VNĐ</li>
      </ul>
      
      <h3>III. THỜI GIAN VÀ ĐỊA ĐIỂM NHẬN HỌC BỔNG</h3>
      <p>Thời gian: Từ ngày 15/11/2024 đến 20/11/2024</p>
      <p>Địa điểm: Phòng Công tác sinh viên - Tầng 2, Nhà A1</p>
      <p>Giờ làm việc: 8h00 - 11h30 và 13h30 - 17h00 (từ thứ 2 đến thứ 6)</p>
      
      <h3>IV. HỒ SƠ CẦN MANG THEO</h3>
      <ol>
        <li>Thẻ sinh viên</li>
        <li>CMND/CCCD</li>
        <li>Giấy xác nhận tài khoản ngân hàng (nếu nhận chuyển khoản)</li>
      </ol>
      
      <p style="margin-top: 2rem;">Chúc mừng các bạn sinh viên đạt học bổng!</p>
    `,
    attachments: [
      {
        id: 1,
        name: "Danh_sach_hoc_bong_HK1_2024.pdf",
        size: "1.8 MB",
        type: "PDF",
      },
    ],
  },
};

export function AnnouncementDetail({ id }: { id: string }) {
  const announcement = announcementData[id] || announcementData["1"];

  return (
    <div className="space-y-6">
      {/* Back button */}
      <Button variant="ghost" size="sm" asChild>
        <Link href="/announcements">
          <ChevronLeft className="mr-2 h-4 w-4" />
          Quay lại danh sách
        </Link>
      </Button>

      {/* Main content */}
      <Card>
        <CardHeader className="space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="mb-3 flex items-center gap-2">
                {announcement.isPinned && (
                  <Pin className="h-5 w-5 text-primary" />
                )}
                <Badge variant="secondary">{announcement.category}</Badge>
              </div>
              <h1 className="text-balance text-3xl font-bold leading-tight">
                {announcement.title}
              </h1>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar>
                <AvatarImage
                  src={announcement.authorAvatar || "/placeholder.svg"}
                />
                <AvatarFallback>{announcement.author[0]}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{announcement.author}</p>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {new Date(announcement.date).toLocaleDateString("vi-VN")}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    <span>{announcement.views} lượt xem</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Bookmark className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <Separator />

        <CardContent className="pt-6">
          {/* Content */}
          <div
            className="prose prose-slate max-w-none dark:prose-invert"
            dangerouslySetInnerHTML={{ __html: announcement.content }}
          />

          {/* Attachments */}
          {announcement.attachments && announcement.attachments.length > 0 && (
            <div className="mt-8">
              <Separator className="mb-6" />
              <h3 className="mb-4 text-lg font-semibold">File đính kèm</h3>
              <div className="space-y-3">
                {announcement.attachments.map((file: any) => (
                  <Card key={file.id} className="border-2">
                    <CardContent className="flex items-center justify-between p-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                          <FileText className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{file.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {file.type} • {file.size}
                          </p>
                        </div>
                      </div>
                      <Button>
                        <Download className="mr-2 h-4 w-4" />
                        Tải xuống
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

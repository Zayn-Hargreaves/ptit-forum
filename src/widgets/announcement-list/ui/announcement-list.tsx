"use client";

import { useState } from "react";
import { Calendar, Pin, FileText, Download } from "lucide-react";
import Link from "next/link";
import { Card, CardContent } from "@shared/ui/card/card";
import { Badge } from "@shared/ui/badge/badge";
import { Button } from "@shared/ui/button/button";
import { Pagination } from "@shared/ui/pagination/pagination";

const announcements = [
  {
    id: 1,
    title: "Thông báo lịch thi giữa kỳ học kỳ 1 năm học 2024-2025",
    excerpt:
      "Phòng Đào tạo thông báo lịch thi giữa kỳ các môn học trong học kỳ 1 năm học 2024-2025...",
    category: "Học vụ",
    author: "Phòng Đào tạo",
    date: "2024-11-10",
    isPinned: true,
    hasAttachment: true,
    downloadUrl: "https://example.com/files/lich-thi-giua-ky-hk1-2024-2025.zip",
    views: 1234,
  },
  {
    id: 2,
    title: "Thông báo về học bổng khuyến khích học tập kỳ 1/2024",
    excerpt:
      "Phòng Công tác sinh viên thông báo danh sách sinh viên đạt học bổng khuyến khích học tập...",
    category: "Học bổng",
    author: "Phòng CTSV",
    date: "2024-11-08",
    isPinned: true,
    hasAttachment: true,
    downloadUrl: "https://example.com/files/danh-sach-hoc-bong-hk1-2024.pdf",
    views: 892,
  },
  {
    id: 3,
    title: "Thông báo tuyển dụng thực tập sinh tại FPT Software",
    excerpt:
      "FPT Software thông báo tuyển dụng thực tập sinh cho các vị trí lập trình viên...",
    category: "Tuyển dụng",
    author: "Phòng Quan hệ doanh nghiệp",
    date: "2024-11-05",
    isPinned: false,
    hasAttachment: false,
    downloadUrl: null,
    views: 567,
  },
  {
    id: 4,
    title: "Kế hoạch tổ chức Ngày hội việc làm PTIT 2024",
    excerpt:
      "Trường thông báo kế hoạch tổ chức Ngày hội việc làm PTIT 2024 dự kiến diễn ra vào ngày 25/11...",
    category: "CLB & Hoạt động",
    author: "Phòng CTSV",
    date: "2024-11-03",
    isPinned: false,
    hasAttachment: true,
    downloadUrl:
      "https://example.com/files/ke-hoach-ngay-hoi-viec-lam-ptit-2024.pdf",
    views: 445,
  },
  {
    id: 5,
    title: "Hướng dẫn đăng ký học phần học kỳ 2 năm học 2024-2025",
    excerpt:
      "Phòng Đào tạo hướng dẫn sinh viên đăng ký học phần cho học kỳ 2 năm học 2024-2025...",
    category: "Học vụ",
    author: "Phòng Đào tạo",
    date: "2024-11-01",
    isPinned: false,
    hasAttachment: true,
    downloadUrl:
      "https://example.com/files/huong-dan-dang-ky-hoc-phan-hk2-2024-2025.docx",
    views: 1567,
  },
];

export function AnnouncementsList() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(announcements.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedAnnouncements = announcements.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {paginatedAnnouncements.map((announcement) => (
          <Card
            key={announcement.id}
            className={`transition-all hover:border-primary/50 hover:shadow-md ${
              announcement.isPinned
                ? "border-2 border-primary/30 bg-primary/5"
                : ""
            }`}
          >
            <CardContent className="p-6">
              <div className="flex gap-4">
                <div className="flex-1">
                  <div className="mb-3 flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="mb-2 flex items-center gap-2">
                        {announcement.isPinned && (
                          <Pin className="h-4 w-4 text-primary" />
                        )}
                        <Link href={`/announcements/${announcement.id}`}>
                          <h3 className="text-lg font-semibold leading-tight hover:text-primary">
                            {announcement.title}
                          </h3>
                        </Link>
                      </div>
                      <p className="mb-3 text-sm text-muted-foreground">
                        {announcement.excerpt}
                      </p>
                    </div>
                    <Badge variant="secondary">{announcement.category}</Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{announcement.author}</span>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {new Date(announcement.date).toLocaleDateString(
                            "vi-VN"
                          )}
                        </span>
                      </div>
                      <span>{announcement.views} lượt xem</span>
                    </div>

                    <div className="flex items-center gap-2">
                      {announcement.downloadUrl ? (
                        <Button
                          variant="outline"
                          size="sm"
                          asChild
                          aria-label={`Tải xuống file đính kèm cho thông báo: ${announcement.title}`}
                        >
                          <a href={announcement.downloadUrl} download>
                            <Download className="mr-2 h-4 w-4" />
                            Tải file
                          </a>
                        </Button>
                      ) : announcement.hasAttachment ? (
                        <Button
                          variant="outline"
                          size="sm"
                          disabled
                          aria-label="File đính kèm không khả dụng"
                        >
                          <Download className="mr-2 h-4 w-4" />
                          Tải file
                        </Button>
                      ) : null}
                      <Button variant="default" size="sm" asChild>
                        <Link href={`/announcements/${announcement.id}`}>
                          <FileText className="mr-2 h-4 w-4" />
                          Xem chi tiết
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center pt-4">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </div>
  );
}

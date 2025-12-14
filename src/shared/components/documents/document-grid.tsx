"use client";

import { useState } from "react";

import { Download, Eye, FileText, Bookmark } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardFooter } from "@shared/ui/card/card";
import { Badge } from "@shared/ui/badge/badge";
import { Button } from "@shared/ui/button/button";
import { Pagination } from "@shared/ui/pagination/pagination";

const documents = [
  {
    id: 1,
    title: "Slide bài giảng Lập trình hướng đối tượng - Chương 1",
    subject: "OOP",
    type: "Slide",
    semester: "Kỳ 3",
    uploader: "Nguyễn Văn A",
    uploadDate: "2 ngày trước",
    downloads: 234,
    views: 567,
    fileType: "PDF",
    fileSize: "2.5 MB",
  },
  {
    id: 2,
    title: "Đề thi giữa kỳ Cơ sở dữ liệu 2023",
    subject: "Database",
    type: "Đề thi",
    semester: "Kỳ 4",
    uploader: "Trần Thị B",
    uploadDate: "5 ngày trước",
    downloads: 189,
    views: 423,
    fileType: "PDF",
    fileSize: "1.2 MB",
  },
  {
    id: 3,
    title: "Bài tập thực hành Mạng máy tính - Lab 1-5",
    subject: "Network",
    type: "Bài tập",
    semester: "Kỳ 5",
    uploader: "Lê Văn C",
    uploadDate: "1 tuần trước",
    downloads: 156,
    views: 345,
    fileType: "ZIP",
    fileSize: "5.8 MB",
  },
  {
    id: 4,
    title: "Tóm tắt Cấu trúc dữ liệu & Giải thuật",
    subject: "DSA",
    type: "Ghi chú",
    semester: "Kỳ 3",
    uploader: "Phạm Thị D",
    uploadDate: "2 tuần trước",
    downloads: 298,
    views: 678,
    fileType: "PDF",
    fileSize: "3.4 MB",
  },
  {
    id: 5,
    title: "Source code project Hệ quản trị CSDL",
    subject: "Database",
    type: "Bài tập",
    semester: "Kỳ 4",
    uploader: "Hoàng Văn E",
    uploadDate: "3 tuần trước",
    downloads: 167,
    views: 289,
    fileType: "ZIP",
    fileSize: "12.3 MB",
  },
  {
    id: 6,
    title: "Slide Hệ điều hành - Toàn bộ khóa học",
    subject: "OS",
    type: "Slide",
    semester: "Kỳ 5",
    uploader: "Vũ Thị F",
    uploadDate: "1 tháng trước",
    downloads: 445,
    views: 892,
    fileType: "PDF",
    fileSize: "18.7 MB",
  },
];

export function DocumentGrid() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const totalPages = Math.ceil(documents.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedDocuments = documents.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {documents.length} tài liệu • Trang {currentPage}/{totalPages}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {paginatedDocuments.map((doc) => (
          <Card
            key={doc.id}
            className="transition-all hover:border-primary/50 hover:shadow-md"
          >
            <CardContent className="p-6">
              <div className="mb-4 flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <FileText className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <Link href={`/documents/${doc.id}`}>
                      <h3 className="mb-2 font-semibold leading-tight hover:text-primary">
                        {doc.title}
                      </h3>
                    </Link>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary">{doc.subject}</Badge>
                      <Badge variant="outline">{doc.type}</Badge>
                      <Badge variant="outline">{doc.semester}</Badge>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-4 space-y-1 text-sm text-muted-foreground">
                <p>Người tải lên: {doc.uploader}</p>
                <p>
                  {doc.fileType} • {doc.fileSize} • {doc.uploadDate}
                </p>
              </div>

              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Download className="h-4 w-4" />
                    <span>{doc.downloads}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    <span>{doc.views}</span>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex gap-2 border-t p-4">
              <Button variant="default" size="sm" className="flex-1" asChild>
                <Link href={`/documents/${doc.id}`}>
                  <Eye className="mr-2 h-4 w-4" />
                  Xem
                </Link>
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1 bg-transparent"
              >
                <Download className="mr-2 h-4 w-4" />
                Tải về
              </Button>
              <Button variant="ghost" size="sm">
                <Bookmark className="h-4 w-4" />
              </Button>
            </CardFooter>
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

// 📂 src/entities/announcement/ui/announcement-detail.tsx
"use client";

import { useMemo } from "react";
import DOMPurify from "isomorphic-dompurify"; // ✅ Dùng bản này an toàn cho Next.js
import Link from "next/link";
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

import { Avatar, AvatarImage, AvatarFallback } from "@shared/ui/avatar/avatar";
import { Badge } from "@shared/ui/badge/badge";
import { Button } from "@shared/ui/button/button";
import { Card, CardContent, CardHeader } from "@shared/ui/card/card";
import { Separator } from "@shared/ui/separator/separator";
import { formatDate } from "@shared/lib/utils";
import { Announcement } from "../model/types";

interface AnnouncementDetailProps {
  data: Announcement;
}

export function AnnouncementDetail({ data }: AnnouncementDetailProps) {
  const sanitizedContent = useMemo(() => {
    return DOMPurify.sanitize(data.content);
  }, [data.content]);

  return (
    <div className="space-y-6">
      {/* Back button */}
      <Button variant="ghost" size="sm" asChild>
        <Link href="/announcements">
          <ChevronLeft className="mr-2 h-4 w-4" />
          Quay lại danh sách
        </Link>
      </Button>

      <Card>
        <CardHeader className="space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="mb-3 flex items-center gap-2">
                {data.isPinned && <Pin className="h-5 w-5 text-primary" />}
                <Badge variant="secondary">{data.category}</Badge>
              </div>
              <h1 className="text-balance text-3xl font-bold leading-tight">
                {data.title}
              </h1>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar>
                <AvatarImage
                  src={data.authorAvatar || "/placeholder.svg"}
                  alt={data.author}
                />
                <AvatarFallback>
                  {data.author?.[0]?.toUpperCase() || "?"}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{data.author}</p>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(data.date)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    <span>{data.views} lượt xem</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" aria-label="Lưu thông báo">
                <Bookmark className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                aria-label="Chia sẻ thông báo"
              >
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <Separator />

        <CardContent className="pt-6">
          {/* Content đã sanitize */}
          <div
            className="prose prose-slate max-w-none dark:prose-invert"
            dangerouslySetInnerHTML={{ __html: sanitizedContent }}
          />

          {/* Attachments Logic */}
          {data.attachments && data.attachments.length > 0 && (
            <div className="mt-8">
              <Separator className="mb-6" />
              <h3 className="mb-4 text-lg font-semibold">File đính kèm</h3>
              <div className="space-y-3">
                {data.attachments.map((file) => (
                  <Card
                    key={file.id}
                    className="border-2 transition-colors hover:bg-muted/50"
                  >
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
                      <Button variant="secondary" asChild>
                        <a
                          href={file.url}
                          download
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Download className="mr-2 h-4 w-4" />
                          Tải xuống
                        </a>
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

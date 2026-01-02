"use client";

import { useMemo } from "react";
import { Badge } from "@shared/ui/badge/badge";
import { Button } from "@shared/ui/button/button";
import { Card, CardContent, CardHeader } from "@shared/ui/card/card";
import { Separator } from "@shared/ui/separator/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@shared/ui/avatar/avatar";
import { Calendar, Eye, Share2, Bookmark, ChevronLeft, Paperclip } from "lucide-react";
import Link from "next/link";
import { AnnouncementDetail as AnnouncementDetailType } from "../model/types";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { AttachmentItem } from "./attachment-item";
import DOMPurify from "isomorphic-dompurify";
import { toast } from "sonner";

interface Props {
  data: AnnouncementDetailType;
}

export function AnnouncementDetail({ data }: Readonly<Props>) {
  const sanitized = useMemo(
    () => DOMPurify.sanitize(data.content),
    [data.content]
  );

  const handleShare = async () => {
    if (typeof window === "undefined" || !data) return;

    const url = window.location.href;
    const title = data.title;
    const text = `Đọc thông báo "${title}" trên Diễn đàn`;

    if (
      typeof navigator !== "undefined" &&
      typeof navigator.share === "function"
    ) {
      try {
        await navigator.share({ title, text, url });
        return;
      } catch (error: unknown) {
        if (error instanceof Error && error.name === "AbortError") return;
      }
    }
    // Fallback: copy link
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
      } else {
        const ta = document.createElement("textarea");
        ta.value = url;
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        ta.remove();
      }

      toast.success("Đã sao chép liên kết", {
        description: "Bạn có thể dán link này để chia sẻ.",
      });
    } catch {
      toast.error("Lỗi sao chép", {
        description: "Trình duyệt không hỗ trợ tự động sao chép.",
      });
    }
  };

  return (
    <div className="space-y-6">
      <Button variant="ghost" size="sm" asChild>
        <Link href="/announcements">
          <ChevronLeft className="mr-2 h-4 w-4" />
          Quay lại danh sách
        </Link>
      </Button>

      <Card>
        <CardHeader className="space-y-4">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <Badge variant="secondary">{data.category}</Badge>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold leading-tight text-gray-900 dark:text-gray-100">
              {data.title}
            </h1>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-4">
              <Avatar>
                <AvatarImage src="/placeholder-avatar.png" alt={data.author} />
                <AvatarFallback>
                  {data.author?.charAt(0)?.toUpperCase() || "A"}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-sm">{data.author}</p>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>
                      {new Date(data.date).toLocaleDateString("vi-VN")}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="icon" title="Lưu" disabled>
                <Bookmark className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                title="Chia sẻ"
                onClick={handleShare}
              >
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <Separator />

        <CardContent className="pt-6">
          <div
            className="prose prose-slate max-w-none dark:prose-invert prose-img:rounded-lg prose-headings:font-bold"
            dangerouslySetInnerHTML={{
              __html: sanitized,
            }}
          />

          {data.attachments && data.attachments.length > 0 && (
            <div className="mt-8">
              <Separator className="mb-6" />
              <h3 className="mb-4 text-lg font-semibold flex items-center gap-2">
                <Paperclip className="h-4 w-4" /> File đính kèm
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.attachments.map((file) => (
                  <AttachmentItem key={file.id} attachment={file} />
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

import { Badge } from "@shared/ui/badge/badge";
import { Button } from "@shared/ui/button/button";
import { Card, CardContent, CardHeader } from "@shared/ui/card/card";
import { Separator } from "@shared/ui/separator/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@shared/ui/avatar/avatar";
import { Calendar, Eye, Share2, Bookmark, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { AnnouncementDetail as AnnouncementDetailType } from "../model/types";
import DOMPurify from "isomorphic-dompurify";
import "@shared/styles/globals.css";

interface Props {
  data: AnnouncementDetailType;
}

export function AnnouncementDetail({ data }: Readonly<Props>) {
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
                <AvatarImage src="/placeholder-avatar.png" />
                <AvatarFallback>{data.author.charAt(0)}</AvatarFallback>
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
                  {/* Backend chưa có views thì ẩn hoặc hardcode */}
                  {/* <div className="flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    <span>{data.views} lượt xem</span>
                  </div> */}
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="icon" title="Lưu" disabled>
                <Bookmark className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" title="Chia sẻ" disabled>
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <Separator />

        <CardContent className="pt-6">
          {/* Render HTML Content từ Backend an toàn */}
          <div
            className="prose prose-slate max-w-none dark:prose-invert prose-img:rounded-lg prose-headings:font-bold"
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(data.content),
            }}
          />

          {/*  WARNING: Backend chưa trả về attachments.
             Phần này comment lại chờ Backend update.
          */}
          {/* <div className="mt-8">
             <Separator className="mb-6" />
             <h3 className="mb-4 text-lg font-semibold">File đính kèm</h3>
              ... Logic render file ...
          </div> 
          */}
        </CardContent>
      </Card>
    </div>
  );
}

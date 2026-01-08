'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@shared/ui/avatar/avatar';
import { Badge } from '@shared/ui/badge/badge';
import { Button } from '@shared/ui/button/button';
import { Card, CardContent, CardHeader } from '@shared/ui/card/card';
import { Separator } from '@shared/ui/separator/separator';
import DOMPurify from 'isomorphic-dompurify';
import { Bookmark, Calendar, ChevronLeft, Paperclip, Share2 } from 'lucide-react';
import Link from 'next/link';
import { useMemo } from 'react';
import { toast } from 'sonner';

import { AnnouncementDetail as AnnouncementDetailType } from '../model/types';
import { AttachmentItem } from './attachment-item';

interface Props {
  data: AnnouncementDetailType;
}

export function AnnouncementDetail({ data }: Readonly<Props>) {
  const sanitized = useMemo(() => DOMPurify.sanitize(data.content), [data.content]);

  const handleShare = async () => {
    if (typeof window === 'undefined' || !data) return;

    const url = window.location.href;
    const title = data.title;
    const text = `Đọc thông báo "${title}" trên Diễn đàn`;

    if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
      try {
        await navigator.share({ title, text, url });
        return;
      } catch (error: unknown) {
        if (error instanceof Error && error.name === 'AbortError') return;
      }
    }
    // Fallback: copy link
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
      } else {
        const ta = document.createElement('textarea');
        ta.value = url;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        ta.remove();
      }

      toast.success('Đã sao chép liên kết', {
        description: 'Bạn có thể dán link này để chia sẻ.',
      });
    } catch {
      toast.error('Lỗi sao chép', {
        description: 'Trình duyệt không hỗ trợ tự động sao chép.',
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
            <h1 className="text-2xl leading-tight font-bold text-gray-900 md:text-3xl dark:text-gray-100">
              {data.title}
            </h1>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-4">
              <Avatar>
                <AvatarImage src="/placeholder-avatar.png" alt={data.author} />
                <AvatarFallback>{data.author?.charAt(0)?.toUpperCase() || 'A'}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">{data.author}</p>
                <div className="text-muted-foreground flex items-center gap-3 text-xs">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>{new Date(data.date).toLocaleDateString('vi-VN')}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="icon" title="Lưu" disabled>
                <Bookmark className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" title="Chia sẻ" onClick={handleShare}>
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <Separator />

        <CardContent className="pt-6">
          <div
            className="prose prose-slate dark:prose-invert prose-img:rounded-lg prose-headings:font-bold max-w-none"
            dangerouslySetInnerHTML={{
              __html: sanitized,
            }}
          />

          {data.attachments && data.attachments.length > 0 && (
            <div className="mt-8">
              <Separator className="mb-6" />
              <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold">
                <Paperclip className="h-4 w-4" /> File đính kèm
              </h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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

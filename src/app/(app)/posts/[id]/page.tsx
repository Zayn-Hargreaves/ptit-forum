'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import {
  ArrowLeft,
  Calendar,
  Eye,
  MessageSquare,
  Share2,
  MoreHorizontal,
  Paperclip,
  Edit,
  Trash2,
  Flag,
  Loader2,
  Download,
  Eye as EyeIcon,
  FileText,
  Image,
  Video,
} from 'lucide-react';
import { toast } from 'sonner';

import { postApi } from '@entities/post/api/post-api';
import { PostContent } from '@entities/post/ui/post-content';
import { Avatar, AvatarFallback, AvatarImage } from '@shared/ui/avatar/avatar';
import { Button } from '@shared/ui/button/button';
import { Badge } from '@shared/ui/badge/badge';
import { Skeleton } from '@shared/ui/skeleton/skeleton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@shared/ui/dropdown-menu/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@shared/ui/alert-dialog/alert-dialog';

import { ReactionButton } from '@features/reaction/ui/reaction-button';
import { CommentSection } from '@widgets/post-comments/comment-section';
import { EditPostDialog } from '@features/post/update-post/ui/edit-post-dialog';
import { ReportDialog } from '@features/report/ui/report-dialog';
import type { Post, PostAttachment } from '@entities/post/model/types';
import { TargetType } from '@entities/interaction/model/types';

export default function PostDetailPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();

  // Chặn double view trong React StrictMode
  const hasViewedRef = useRef(false);

  // Modal states
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);

  const id = (() => {
    if (typeof params?.id === 'string') return params.id;
    if (Array.isArray(params?.id)) return params.id[0];
    return '';
  })();

  /* =====================
   * 1. VIEW COUNT
   * ===================== */
  useEffect(() => {
    if (!id || hasViewedRef.current) return;

    const trackView = async () => {
      try {
        await postApi.increaseView(id);
        hasViewedRef.current = true;
      } catch (err) {
        console.error('Failed to track view', err);
      }
    };

    trackView();
  }, [id]);

  /* =====================
   * 2. FETCH POST
   * ===================== */
  const {
    data: post,
    isLoading,
    isError,
  } = useQuery<Post>({
    queryKey: ['post', id],
    queryFn: () => postApi.getDetail(id),
    enabled: !!id,
    retry: 1,
  });

  /* =====================
   * 3. DELETE POST
   * ===================== */
  const { mutate: deletePost, isPending: isDeleting } = useMutation({
    mutationFn: (postId: string) => postApi.delete(postId),
    onSuccess: () => {
      toast.success('Đã xóa bài viết');
      router.push('/forum');
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
    onError: () => toast.error('Không thể xóa bài viết lúc này'),
  });

  /* =====================
   * 4. ATTACHMENT HELPERS
   * ===================== */
  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '';
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'IMAGE':
        return <Image className="h-4 w-4 text-green-600" />;
      case 'VIDEO':
        return <Video className="h-4 w-4 text-blue-600" />;
      case 'DOCUMENT':
      default:
        return <FileText className="h-4 w-4 text-gray-600" />;
    }
  };

  const handleViewFile = (file: PostAttachment) => {
    console.log(file);
    if (!file.url) {
      toast.error('URL không khả dụng');
      return;
    }

    try {
      const url = new URL(file.url);
      if (!['http:', 'https:'].includes(url.protocol)) {
        toast.error('URL không hợp lệ');
        return;
      }
    } catch (err) {
      console.error(err);
      toast.error('URL không hợp lệ');
      return;
    }
    window.open(file.url, '_blank', 'noopener,noreferrer');
  };

  const handleDownloadFile = async (file: PostAttachment) => {
    if (!file.url) {
      toast.error('URL không khả dụng');
      return;
    }

    try {
      const response = await fetch(file.url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.name;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('Đã tải xuống file');
    } catch (error) {
      toast.error('Không thể tải xuống file');
    }
  };

  /* =====================
   * 5. SMART SHARE
   * ===================== */
  const handleShare = async () => {
    if (typeof window === 'undefined' || !post) return;

    const url = window.location.href;
    const title = post.title;
    const text = `Đọc bài viết "${title}" trên Diễn đàn`;

    if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
      try {
        await navigator.share({ title, text, url });
        return;
      } catch (error: unknown) {
        // User bấm hủy share
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

  /* =====================
   * RENDER STATES
   * ===================== */
  if (isLoading) return <PostDetailSkeleton />;

  if (isError || !post) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
        <h2 className="text-2xl font-bold">Không tìm thấy bài viết</h2>
        <Button onClick={() => router.push('/forum')}>Quay lại diễn đàn</Button>
      </div>
    );
  }

  /* =====================
   * RENDER CONTENT
   * ===================== */
  return (
    <div className="container max-w-4xl py-6 mx-auto space-y-8 animate-in fade-in-50">
      {/* HEADER */}
      <div className="space-y-4">
        <Button variant="ghost" size="sm" className="gap-2 -ml-2 text-muted-foreground" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" /> Quay lại
        </Button>

        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2 flex-1">
            <h1 className="text-3xl font-extrabold tracking-tight lg:text-4xl">{post.title}</h1>

            <div className="flex items-center gap-2 flex-wrap">
              {/* ✅ Render Topic thật + fallback nếu null */}
              {post.topic?.name ? (
                <Badge variant="secondary" className="hover:bg-secondary/80">
                  {post.topic.name}
                </Badge>
              ) : (
                <Badge variant="outline" className="text-muted-foreground">
                  General
                </Badge>
              )}

              <span className="text-sm text-muted-foreground">•</span>

              <span className="text-sm text-muted-foreground flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {format(new Date(post.createdDateTime), "dd/MM/yyyy 'lúc' HH:mm", {
                  locale: vi,
                })}
              </span>
            </div>
          </div>

          {/* ACTION MENU */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              {post.permissions?.canReport && (
                <DropdownMenuItem onClick={() => setIsReportOpen(true)}>
                  <Flag className="mr-2 h-4 w-4" /> Báo cáo
                </DropdownMenuItem>
              )}

              {post.permissions?.canEdit && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setIsEditOpen(true)}>
                    <Edit className="mr-2 h-4 w-4" /> Chỉnh sửa
                  </DropdownMenuItem>
                </>
              )}

              {post.permissions?.canDelete && (
                <DropdownMenuItem className="text-destructive" onClick={() => setIsDeleteOpen(true)}>
                  <Trash2 className="mr-2 h-4 w-4" /> Xóa bài viết
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* AUTHOR */}
        <div className="flex items-center justify-between py-4 border-y">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 border">
              <AvatarImage src={post.author?.avatarUrl ?? ''} />
              <AvatarFallback>{post.author?.fullName?.[0] ?? '?'}</AvatarFallback>
            </Avatar>

            <div>
              <div className="font-semibold text-sm">{post.author?.fullName}</div>
              <div className="text-xs text-muted-foreground">
                {post.author?.badge && post.author?.faculty
                  ? `${post.author.badge} - ${post.author.faculty}`
                  : post.author?.badge || post.author?.faculty || ''}
              </div>
            </div>
          </div>

          <Button variant="outline" size="sm" className="gap-2" onClick={handleShare}>
            <Share2 className="h-4 w-4" /> Chia sẻ
          </Button>
        </div>
      </div>

      {/* CONTENT */}
      <PostContent content={post.content} />

      {/* ATTACHMENTS */}
      {post.attachments?.length > 0 && (
        <div className="p-4 border rounded-lg bg-muted/30">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Paperclip className="h-4 w-4" /> Tài liệu đính kèm
          </h3>

          <div className="space-y-2">
            {post.attachments.map((file: PostAttachment) => (
              <div
                key={file.id}
                className="flex items-center justify-between p-3 bg-background border rounded-lg hover:border-primary transition-colors"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  {getFileIcon(file.type)}
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-foreground truncate">{file.name}</div>
                    {file.size && <div className="text-xs text-muted-foreground">{formatFileSize(file.size)}</div>}
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleViewFile(file)}
                    className="h-8 w-8 p-0"
                    title="Xem file"
                  >
                    <EyeIcon className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDownloadFile(file)}
                    className="h-8 w-8 p-0"
                    title="Tải xuống"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* FOOTER */}
      <div className="flex items-center gap-6 py-4 border-t text-muted-foreground">
        <ReactionButton post={post} />
        <div className="flex items-center gap-2">
          <Eye className="h-5 w-5" /> {post.stats?.viewCount ?? 0}
        </div>
        <div className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" /> {post.stats?.commentCount ?? 0}
        </div>
      </div>

      {/* COMMENTS */}
      <CommentSection postId={id} />

      {/* MODALS */}
      <EditPostDialog post={post} open={isEditOpen} onOpenChange={setIsEditOpen} />
      <ReportDialog
        open={isReportOpen}
        onOpenChange={setIsReportOpen}
        targetId={post.id}
        targetType={TargetType.POST}
      />

      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Bạn có chắc muốn xóa?</AlertDialogTitle>
            <AlertDialogDescription>Bài viết sẽ bị ẩn khỏi diễn đàn.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={() => deletePost(id)} className="bg-destructive" disabled={isDeleting}>
              {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Xóa luôn
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

/* =====================
 * SKELETON
 * ===================== */
function PostDetailSkeleton() {
  return (
    <div className="container max-w-4xl py-6 mx-auto space-y-8">
      <Skeleton className="h-8 w-24" />
      <Skeleton className="h-12 w-3/4" />
      <Skeleton className="h-40 w-full" />
    </div>
  );
}

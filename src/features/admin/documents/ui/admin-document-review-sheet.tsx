import { Check, Loader2, ShieldAlert, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { approveDocument, rejectDocument } from '@/shared/api/document.service';
import { Badge } from '@/shared/ui/badge/badge';
import { Button } from '@/shared/ui/button/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/shared/ui/sheet/sheet';
import { Textarea } from '@/shared/ui/textarea/textarea';

import { useAdminDocumentStore } from '../model/admin-store';

export function AdminDocumentReviewSheet() {
  const router = useRouter();
  const { selectedDocument, isOpen, closeReview } = useAdminDocumentStore();

  const [rejectMode, setRejectMode] = useState(false);
  const [reason, setReason] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Reset local state when sheet closes or document changes
  useEffect(() => {
    if (!isOpen) {
      setRejectMode(false);
      setReason('');
      setIsProcessing(false);
    }
  }, [isOpen, selectedDocument]);

  if (!selectedDocument) return null;

  const handleApprove = async () => {
    try {
      setIsProcessing(true);
      await approveDocument(selectedDocument.id);
      toast.success(`Tài liệu "${selectedDocument.title}" đã được phê duyệt`);
      router.refresh();
      closeReview();
    } catch (error) {
      toast.error('Phê duyệt tài liệu thất bại');
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!reason.trim()) {
      toast.error('Vui lòng cung cấp lý do từ chối');
      return;
    }

    try {
      setIsProcessing(true);
      await rejectDocument(selectedDocument.id, reason);
      toast.success(`Tài liệu "${selectedDocument.title}" đã bị từ chối`);
      router.refresh();
      closeReview();
    } catch (error) {
      toast.error('Từ chối tài liệu thất bại');
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && closeReview()}>
      <SheetContent className="flex h-full w-full flex-col overflow-y-auto ring-0 focus-visible:ring-0 sm:max-w-xl md:max-w-2xl lg:max-w-4xl">
        <SheetHeader className="mb-4">
          <div className="flex items-center justify-between">
            <SheetTitle className="truncate pr-4 text-xl font-bold">
              Xem xét: {selectedDocument.title}
            </SheetTitle>
            <Badge variant={selectedDocument.status === 'PUBLISHED' ? 'default' : 'secondary'}>
              {selectedDocument.status}
            </Badge>
          </div>
          <SheetDescription className="flex flex-col gap-1">
            <span className="text-foreground font-medium">
              Tải lên bởi: {selectedDocument.author?.name}
            </span>
            <span className="text-muted-foreground text-xs">
              Môn học: {selectedDocument.subject?.name} • Số trang: {selectedDocument.pageCount}
            </span>
          </SheetDescription>
        </SheetHeader>

        {/* Document Viewer Area */}
        <div className="relative min-h-[50vh] flex-1 overflow-hidden rounded-md border bg-slate-100">
          {selectedDocument.fileUrl ? (
            <iframe
              src={selectedDocument.fileUrl}
              className="absolute inset-0 h-full w-full"
              title="Xem trước tài liệu"
            />
          ) : (
            <div className="text-muted-foreground flex h-full items-center justify-center">
              URL tài liệu không khả dụng.
            </div>
          )}
        </div>

        <SheetFooter className="mt-6 border-t pt-4">
          {rejectMode ? (
            <div className="w-full space-y-3">
              <div className="text-destructive flex items-center gap-2 font-medium">
                <ShieldAlert className="h-4 w-4" /> Từ chối tài liệu
              </div>
              <Textarea
                placeholder="Tại sao tài liệu này bị từ chối? (VD: Chất lượng thấp, Vi phạm bản quyền...)"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="resize-none"
                rows={3}
              />
              <div className="flex justify-end gap-2">
                <Button
                  variant="ghost"
                  onClick={() => setRejectMode(false)}
                  disabled={isProcessing}
                >
                  Hủy
                </Button>
                <Button variant="destructive" onClick={handleReject} disabled={isProcessing}>
                  {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Xác nhận từ chối
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex w-full justify-end gap-3">
              <Button
                variant="destructive"
                onClick={() => setRejectMode(true)}
                disabled={isProcessing}
              >
                <X className="mr-2 h-4 w-4" />
                Từ chối
              </Button>
              <Button
                className="bg-green-600 text-white hover:bg-green-700"
                onClick={handleApprove}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Check className="mr-2 h-4 w-4" />
                )}
                Phê duyệt
              </Button>
            </div>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

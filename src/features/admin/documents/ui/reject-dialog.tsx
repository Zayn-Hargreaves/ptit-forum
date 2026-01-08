import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Label,
  Textarea,
} from '@shared/ui';
import { useState } from 'react';

interface RejectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (reason: string) => void;
  isPending: boolean;
}

export const RejectDialog = ({ open, onOpenChange, onConfirm, isPending }: RejectDialogProps) => {
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!reason.trim()) {
      setError('Vui lòng nhập lý do từ chối');
      return;
    }
    onConfirm(reason);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Từ chối tài liệu</DialogTitle>
          <DialogDescription>
            Vui lòng cung cấp lý do từ chối tài liệu này. Thông tin sẽ được gửi đến tác giả.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="reason">Lý do</Label>
            <Textarea
              id="reason"
              placeholder="VD: Nội dung không phù hợp, Chất lượng thấp..."
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
                if (e.target.value.trim()) setError('');
              }}
              className={error ? 'border-red-500' : ''}
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
            Hủy
          </Button>
          <Button variant="destructive" onClick={handleSubmit} disabled={isPending}>
            {isPending ? 'Đang từ chối...' : 'Từ chối tài liệu'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

'use client';

import { Button } from '@shared/ui/button/button';
import { Clock, Lock } from 'lucide-react';

interface TopicLockedViewProps {
  onRequestJoin: () => void;
  isPending?: boolean;
  isLoading?: boolean;
}

export const TopicLockedView = ({
  onRequestJoin,
  isPending = false,
  isLoading = false,
}: TopicLockedViewProps) => {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed bg-white p-6 py-20 text-center">
      <div className="mb-4 rounded-full bg-gray-100 p-4">
        <Lock className="h-10 w-10 text-gray-500" />
      </div>

      <h2 className="mb-2 text-xl font-bold text-gray-800">Đây là Nhóm Riêng Tư</h2>

      <p className="mb-6 max-w-md text-gray-500">
        Bạn cần là thành viên của nhóm này để xem bài thảo luận và danh sách thành viên.
      </p>

      {isPending ? (
        <div className="flex flex-col items-center gap-3">
          <Button
            disabled
            variant="outline"
            className="border-orange-300 bg-orange-50 text-orange-700 hover:bg-orange-50"
          >
            <Clock className="mr-2 h-4 w-4" />
            Đang chờ phê duyệt
          </Button>
          <p className="text-muted-foreground max-w-sm text-xs">
            Yêu cầu của bạn đang được quản trị viên xem xét. Bạn sẽ nhận được thông báo khi được
            chấp nhận.
          </p>
        </div>
      ) : (
        <Button
          onClick={onRequestJoin}
          disabled={isLoading}
          className="bg-primary hover:bg-primary/90"
        >
          {isLoading ? (
            <>
              <Clock className="mr-2 h-4 w-4 animate-spin" />
              Đang gửi...
            </>
          ) : (
            <>
              <Lock className="mr-2 h-4 w-4" />
              Gửi yêu cầu tham gia
            </>
          )}
        </Button>
      )}
    </div>
  );
};

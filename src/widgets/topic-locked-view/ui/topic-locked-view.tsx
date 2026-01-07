'use client';

import { Lock, Clock } from 'lucide-react';
import { Button } from '@shared/ui/button/button';

interface TopicLockedViewProps {
  onRequestJoin: () => void;
  isPending?: boolean;
  isLoading?: boolean;
}

export const TopicLockedView = ({ 
  onRequestJoin, 
  isPending = false,
  isLoading = false 
}: TopicLockedViewProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-dashed text-center p-6">
      <div className="bg-gray-100 p-4 rounded-full mb-4">
        <Lock className="w-10 h-10 text-gray-500" />
      </div>
      
      <h2 className="text-xl font-bold text-gray-800 mb-2">
        Đây là Nhóm Riêng Tư
      </h2>
      
      <p className="text-gray-500 max-w-md mb-6">
        Bạn cần là thành viên của nhóm này để xem bài thảo luận và danh sách thành viên.
      </p>
      
      {isPending ? (
        <div className="flex flex-col items-center gap-3">
          <Button 
            disabled 
            variant="outline"
            className="border-orange-300 bg-orange-50 text-orange-700 hover:bg-orange-50"
          >
            <Clock className="w-4 h-4 mr-2" />
            Đang chờ phê duyệt
          </Button>
          <p className="text-xs text-muted-foreground max-w-sm">
            Yêu cầu của bạn đang được quản trị viên xem xét. Bạn sẽ nhận được thông báo khi được chấp nhận.
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
              <Clock className="w-4 h-4 mr-2 animate-spin" />
              Đang gửi...
            </>
          ) : (
            <>
              <Lock className="w-4 h-4 mr-2" />
              Gửi yêu cầu tham gia
            </>
          )}
        </Button>
      )}
    </div>
  );
};

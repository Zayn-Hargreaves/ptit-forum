import { topicApi } from '@shared/api/topic.service';
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@shared/ui';
import { useQueryClient } from '@tanstack/react-query';
import { Eye, MoreHorizontal, Trash } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import { TopicResponse } from '@/entities/topic/model/types';

import { useTopicStore } from '../model/topic-store';

interface ActionCellProps {
  topic: TopicResponse;
}

export const ActionCell = ({ topic }: ActionCellProps) => {
  const { openDetail } = useTopicStore();
  const queryClient = useQueryClient();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`Bạn có chắc muốn xóa topic "${topic.title}"?`)) return;

    try {
      setIsDeleting(true);
      await topicApi.softDelete(topic.id);
      toast.success('Đã xóa topic');
      queryClient.invalidateQueries({ queryKey: ['admin-topics'] });
    } catch {
      toast.error('Xóa thất bại');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Thao tác</DropdownMenuLabel>

        <DropdownMenuItem onClick={() => openDetail(topic)}>
          <Eye className="mr-2 h-4 w-4" />
          Xem chi tiết
        </DropdownMenuItem>

        <DropdownMenuItem onClick={handleDelete} className="text-red-600 focus:text-red-600">
          <Trash className="mr-2 h-4 w-4" />
          {isDeleting ? 'Đang xóa...' : 'Xóa'}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@shared/ui';
import { useQueryClient } from '@tanstack/react-query';
import { MoreHorizontal, Trash } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import { SubjectReferenceResponse } from '@/entities/subject-reference/model/types';
import { subjectReferenceApi } from '@/shared/api/subject-reference.service';

interface ActionCellProps {
  data: SubjectReferenceResponse;
}

export const ActionCell = ({ data }: ActionCellProps) => {
  const queryClient = useQueryClient();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm('Bạn có chắc muốn xóa tham chiếu môn học này?')) return;

    try {
      setIsDeleting(true);
      await subjectReferenceApi.delete(data.subjectReferenceId);
      toast.success('Đã xóa thành công');
      queryClient.invalidateQueries({ queryKey: ['admin-subject-references'] });
    } catch (_error) {
      toast.error('Xóa thất bại');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Mở menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
        <DropdownMenuItem onClick={handleDelete} className="text-red-600 focus:text-red-600">
          <Trash className="mr-2 h-4 w-4" />
          {isDeleting ? 'Đang xóa...' : 'Xóa'}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@shared/ui';
import { useQueryClient } from '@tanstack/react-query';
import { Edit, MoreHorizontal, Trash } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import { SubjectResponse } from '@/entities/subject/model/types';
import { subjectApi } from '@/shared/api/subject.service';

import { useSubjectStore } from '../model/subject-store';

interface ActionCellProps {
  subject: SubjectResponse;
}

export const ActionCell = ({ subject }: ActionCellProps) => {
  const { openEdit } = useSubjectStore();
  const queryClient = useQueryClient();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`Bạn có chắc muốn xóa môn học "${subject.subjectName}"?`)) return;

    try {
      setIsDeleting(true);
      await subjectApi.delete(subject.id);
      toast.success('Đã xóa môn học');
      queryClient.invalidateQueries({ queryKey: ['admin-subjects'] });
    } catch (_error) {
      toast.error('Xóa thất bại (Có thể môn học đang được sử dụng)');
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

        <DropdownMenuItem onClick={() => openEdit(subject)}>
          <Edit className="mr-2 h-4 w-4" /> Chỉnh sửa
        </DropdownMenuItem>

        <DropdownMenuItem onClick={handleDelete} className="text-red-600 focus:text-red-600">
          <Trash className="mr-2 h-4 w-4" />
          {isDeleting ? 'Đang xóa...' : 'Xóa'}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

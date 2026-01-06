import { useQueryClient } from '@tanstack/react-query';
import { ColumnDef } from '@tanstack/react-table';
import { Edit, Trash } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import { Classroom, deleteClassroom } from '@/shared/api/classroom.service';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/shared/ui/alert-dialog/alert-dialog';
import { Badge } from '@/shared/ui/badge/badge';
import { Button } from '@/shared/ui/button/button';

import { useClassroomStore } from '../model/classroom-store';

const ClassroomActionsCell = ({ classroom }: { classroom: Classroom }) => {
  const { openEdit } = useClassroomStore();
  const queryClient = useQueryClient();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await deleteClassroom(classroom.id);
      toast.success('Đã xóa lớp học');
      queryClient.invalidateQueries({
        queryKey: ['admin-classrooms'],
      });
    } catch (error) {
      console.error(error);
      toast.error('Xóa lớp thất bại');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button size="icon" variant="ghost" onClick={() => openEdit(classroom)} title="Chỉnh sửa">
        <Edit className="h-4 w-4" />
      </Button>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button size="icon" variant="ghost" title="Xóa">
            <Trash className="h-4 w-4 text-red-500" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Bạn có chắc chắn muốn xóa?</AlertDialogTitle>
            <AlertDialogDescription>
              Hành động này không thể hoàn tác. Lớp học &quot;{classroom.className}&quot; sẽ bị xóa
              vĩnh viễn khỏi hệ thống.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 text-white hover:bg-red-700"
              onClick={(e) => {
                e.preventDefault();
                handleDelete();
              }}
              disabled={isDeleting}
            >
              {isDeleting ? 'Đang xóa...' : 'Xóa lớp học'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export const columns: ColumnDef<Classroom>[] = [
  {
    accessorKey: 'className',
    header: 'Tên lớp',
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="font-medium">{row.original.className}</span>
        <span className="text-muted-foreground text-xs">{row.original.facultyName}</span>
      </div>
    ),
  },
  {
    accessorKey: 'classCode',
    header: 'Mã lớp',
    cell: ({ row }) => (
      <Badge variant="outline" className="font-mono">
        {row.original.classCode}
      </Badge>
    ),
  },
  {
    accessorKey: 'schoolYearCode',
    header: 'Khóa',
    cell: ({ row }) => <Badge variant="secondary">{row.original.schoolYearCode}</Badge>,
  },
  {
    header: 'Niên khóa',
    cell: ({ row }) => (
      <span className="text-sm">
        {row.original.startedYear} - {row.original.endedYear}
      </span>
    ),
  },
  {
    id: 'actions',
    header: 'Hành động',
    cell: ({ row }) => <ClassroomActionsCell classroom={row.original} />,
  },
];

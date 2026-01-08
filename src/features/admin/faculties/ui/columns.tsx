import { useQueryClient } from '@tanstack/react-query';
import { ColumnDef } from '@tanstack/react-table';
import { Edit, Trash } from 'lucide-react';
import { toast } from 'sonner';

import { Faculty } from '@/shared/api/faculty.service';
import { deleteFaculty } from '@/shared/api/faculty.service';
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

import { useFacultyStore } from '../model/faculty-store';

const FacultyActionsCell = ({ faculty }: { faculty: Faculty }) => {
  const { openEdit } = useFacultyStore();
  const queryClient = useQueryClient();

  const handleDelete = async () => {
    try {
      await deleteFaculty(faculty.id);
      toast.success('Đã xóa khoa');
      queryClient.invalidateQueries({
        queryKey: ['admin-faculties'],
      });
    } catch (error) {
      console.error(error);
      toast.error('Xóa khoa thất bại');
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button size="icon" variant="ghost" onClick={() => openEdit(faculty)} title="Chỉnh sửa">
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
              Hành động này không thể hoàn tác. Dữ liệu của khoa &quot;{faculty.facultyName}&quot;
              sẽ bị xóa vĩnh viễn.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Xóa ngay
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export const columns: ColumnDef<Faculty>[] = [
  {
    accessorKey: 'facultyName',
    header: 'Tên khoa',
    cell: ({ row }) => (
      <div className="flex max-w-[250px] flex-col">
        <span className="truncate font-medium" title={row.original.facultyName}>
          {row.original.facultyName}
        </span>
        {row.original.facultyCode && (
          <span className="text-muted-foreground text-xs">{row.original.facultyCode}</span>
        )}
      </div>
    ),
  },
  {
    accessorKey: 'facultyCode',
    header: 'Mã khoa',
    cell: ({ row }) => (
      <Badge variant="secondary" className="font-mono">
        {row.original.facultyCode}
      </Badge>
    ),
  },
  {
    accessorKey: 'description',
    header: 'Mô tả',
    cell: ({ row }) => (
      <span
        className="text-muted-foreground block max-w-[300px] truncate text-sm"
        title={row.original.description}
      >
        {row.original.description || '—'}
      </span>
    ),
  },
  {
    id: 'actions',
    header: 'Hành động',
    cell: ({ row }) => <FacultyActionsCell faculty={row.original} />,
  },
];

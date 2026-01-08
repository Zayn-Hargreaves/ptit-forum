import { useQueryClient } from '@tanstack/react-query';
import { ColumnDef } from '@tanstack/react-table';
import { Trash } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

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
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar/avatar';

import { deleteUser } from '../api/user.service';
import { User } from '../model/types';

const UserActionsCell = ({ user }: { user: User }) => {
  const queryClient = useQueryClient();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await deleteUser(user.id);
      toast.success('Đã xóa người dùng');
      queryClient.invalidateQueries({
        queryKey: ['admin-users'],
      });
      setIsOpen(false);
    } catch (error) {
      console.error(error);
      toast.error('Xóa người dùng thất bại');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogTrigger asChild>
          <Button size="icon" variant="ghost" title="Xóa">
            <Trash className="h-4 w-4 text-red-500" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Bạn có chắc chắn muốn xóa?</AlertDialogTitle>
            <AlertDialogDescription>
              Hành động này không thể hoàn tác. Người dùng &quot;{user.fullName}&quot; ({user.email}) sẽ bị xóa vĩnh viễn khỏi hệ thống.
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
              {isDeleting ? 'Đang xóa...' : 'Xóa người dùng'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: 'fullName',
    header: 'Người dùng',
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <Avatar className="h-9 w-9">
          <AvatarImage src={row.original.avatarUrl} alt={row.original.fullName} />
          <AvatarFallback>{row.original.fullName?.charAt(0) || 'U'}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <span className="font-medium text-sm">{row.original.fullName}</span>
          <span className="text-muted-foreground text-xs">{row.original.email}</span>
        </div>
      </div>
    ),
  },
  {
    accessorKey: 'studentCode',
    header: 'Mã SV',
    cell: ({ row }) => (
      row.original.studentCode ? (
        <Badge variant="outline" className="font-mono">
          {row.original.studentCode}
        </Badge>
      ) : <span className="text-muted-foreground text-xs">-</span>
    ),
  },
  {
    accessorKey: 'classCode',
    header: 'Lớp',
    cell: ({ row }) => (
      row.original.classCode ? (
        <Badge variant="secondary" className="font-mono">
          {row.original.classCode}
        </Badge>
      ) : <span className="text-muted-foreground text-xs">-</span>
    ),
  },
  {
    accessorKey: 'roles',
    header: 'Vai trò',
    cell: ({ row }) => (
      <div className="flex flex-wrap gap-1">
        {row.original.roles?.map((role) => (
          <Badge key={role.name} variant={role.name === 'ADMIN' ? 'destructive' : 'default'} className="text-[10px]">
            {role.name}
          </Badge>
        ))}
      </div>
    ),
  },
  {
    accessorKey: 'enabled',
    header: 'Trạng thái',
    cell: ({ row }) => (
      <Badge variant={row.original.enabled ? 'default' : 'secondary'}>
        {row.original.enabled ? 'Active' : 'Disabled'}
      </Badge>
    ),
  },
  {
    id: 'actions',
    header: 'Hành động',
    cell: ({ row }) => <UserActionsCell user={row.original} />,
  },
];

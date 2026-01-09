// features/admin/categories/ui/action-cell.tsx

import { categoryApi } from '@shared/api/category.service'; // Nhớ import service category
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

import { CategoryResponse } from '@/entities/category/model/types';

import { useCategoryStore } from '../model/category-store';

interface ActionCellProps {
  category: CategoryResponse;
}

export const ActionCell = ({ category }: ActionCellProps) => {
  const { openEdit } = useCategoryStore();
  const queryClient = useQueryClient();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`Bạn có chắc muốn xóa danh mục "${category.name}"?`)) return;

    try {
      setIsDeleting(true);
      await categoryApi.delete(category.id);
      toast.success('Đã xóa danh mục');
      // Invalidate query key tương ứng với list category
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
    } catch (_error) {
      toast.error('Xóa thất bại. Có thể danh mục đang được sử dụng.');
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

        <DropdownMenuItem onClick={() => openEdit(category)}>
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

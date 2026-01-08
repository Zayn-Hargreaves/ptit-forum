// features/admin/categories/ui/columns.tsx

import { Badge } from '@shared/ui';
import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';

import { CategoryResponse, CategoryType } from '@/entities/category/model/types';

import { ActionCell } from './action-cell';

// Map Enum sang Tiếng Việt hiển thị cho đẹp
const TYPE_LABEL: Record<CategoryType, string> = {
  [CategoryType.ACADEMIC]: 'Học tập',
  [CategoryType.CLASSROOM]: 'Lớp học',
  [CategoryType.CLUB]: 'Câu lạc bộ',
  [CategoryType.LIFE]: 'Đời sống',
};

// Map Enum sang màu Badge (nếu thích)
const TYPE_COLOR: Record<CategoryType, string> = {
  [CategoryType.ACADEMIC]: 'bg-blue-100 text-blue-800 border-blue-200',
  [CategoryType.CLASSROOM]: 'bg-indigo-100 text-indigo-800 border-indigo-200',
  [CategoryType.CLUB]: 'bg-pink-100 text-pink-800 border-pink-200',
  [CategoryType.LIFE]: 'bg-green-100 text-green-800 border-green-200',
};

export const columns: ColumnDef<CategoryResponse>[] = [
  {
    accessorKey: 'name',
    header: 'Tên danh mục',
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="font-medium">{row.original.name}</span>
      </div>
    ),
  },
  {
    accessorKey: 'categoryType',
    header: 'Loại',
    cell: ({ row }) => {
      const type = row.original.categoryType;
      return (
        <Badge variant="outline" className={`${TYPE_COLOR[type]} hover:${TYPE_COLOR[type]}`}>
          {TYPE_LABEL[type] || type}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'description',
    header: 'Mô tả',
    cell: ({ row }) => (
      <span
        className="text-muted-foreground block max-w-[300px] truncate text-sm"
        title={row.original.description}
      >
        {row.original.description || '-'}
      </span>
    ),
  },
  {
    accessorKey: 'createdAt',
    header: 'Ngày tạo',
    cell: ({ row }) => {
      if (!row.original.createdAt) return <span>-</span>;
      const date = new Date(row.original.createdAt);
      return (
        <span className="text-muted-foreground text-sm">{format(date, 'dd/MM/yyyy HH:mm')}</span>
      );
    },
  },
  {
    id: 'actions',
    header: 'Hành động',
    cell: ({ row }) => <ActionCell category={row.original} />,
  },
];

// features/admin/semesters/ui/columns.tsx

import { Badge } from '@shared/ui';
import { ColumnDef } from '@tanstack/react-table';

import { SemesterResponse } from '@/entities/semesters/model/types';

export const columns: ColumnDef<SemesterResponse>[] = [
  {
    accessorKey: 'id',
    header: 'Mã học kỳ',
    cell: ({ row }) => <span className="font-bold">{row.original.id}</span>,
  },
  {
    accessorKey: 'semesterType',
    header: 'Tên học kỳ',
    cell: ({ row }) => (
      <Badge variant="outline" className="bg-blue-50 text-blue-700 hover:bg-blue-50">
        Học kỳ {row.original.semesterType}
      </Badge>
    ),
  },
  {
    accessorKey: 'schoolYear',
    header: 'Năm học',
    cell: ({ row }) => <span className="font-medium">{row.original.schoolYear}</span>,
  },
  // Hiện tại Backend chưa có API Update/Delete nên không có cột Action
];

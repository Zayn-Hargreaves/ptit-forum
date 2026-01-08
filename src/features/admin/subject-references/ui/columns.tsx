import { Badge } from '@shared/ui/badge/badge';
import { ColumnDef } from '@tanstack/react-table';

import { SubjectReferenceResponse } from '@/entities/subject-reference/model/types';

import { ActionCell } from './action-cell';

export const columns: ColumnDef<SubjectReferenceResponse>[] = [
  {
    accessorKey: 'subjectName',
    header: 'Subject Name',
    cell: ({ row }) => (
      // Tốt nhất nên map sang Tên Môn nếu có thể
      <span className="text-muted-foreground font-mono text-xs">{row.original.subjectName}</span>
    ),
  },
  {
    accessorKey: 'facultyName',
    header: 'Faculty Name',
    cell: ({ row }) => (
      <span className="text-muted-foreground font-mono text-xs">{row.original.facultyName}</span>
    ),
  },
  {
    accessorKey: 'cohortCode',
    header: 'Khóa',
    cell: ({ row }) => <Badge variant="outline">{row.original.cohortCode}</Badge>,
  },
  {
    accessorKey: 'semesterId',
    header: 'Học kỳ',
    cell: ({ row }) => <div className="pl-4">{row.original.semesterId}</div>,
  },
  {
    id: 'actions',
    header: 'Hành động',
    cell: ({ row }) => <ActionCell data={row.original} />,
  },
];

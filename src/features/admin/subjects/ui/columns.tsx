import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';

import { SubjectResponse } from '@/entities/subject/model/types';

import { ActionCell } from './action-cell';

export const columns: ColumnDef<SubjectResponse>[] = [
  {
    accessorKey: 'subjectName',
    header: 'Tên môn học',
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="font-medium">{row.original.subjectName}</span>
        {/* Có thể thêm tooltip description nếu cần */}
      </div>
    ),
  },
  {
    accessorKey: 'subjectCode',
    header: 'Mã môn',
    cell: ({ row }) => <span className="font-mono text-sm">{row.original.subjectCode}</span>,
  },
  {
    accessorKey: 'credit',
    header: 'Tín chỉ',
    cell: ({ row }) => <div className="pl-4">{row.original.credit}</div>,
  },
  {
    accessorKey: 'createdDate',
    header: 'Ngày tạo',
    cell: ({ row }) => {
      if (!row.original.createdDate) return <span>-</span>;
      const date = new Date(row.original.createdDate);
      return <span className="text-muted-foreground text-sm">{format(date, 'dd/MM/yyyy')}</span>;
    },
  },
  {
    id: 'actions',
    header: 'Hành động',
    cell: ({ row }) => <ActionCell subject={row.original} />,
  },
];

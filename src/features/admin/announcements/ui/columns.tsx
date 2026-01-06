import { AnnouncementResponse } from '@entities/announcement/model/types';
import { Badge } from '@shared/ui';
import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';

import { ActionCell } from './action-cell';
import Link from 'next/link';

// Map Enum Backend sang Tiếng Việt
const TYPE_MAP: Record<string, string> = {
  GENERAL: 'Thông báo chung',
  CLASS_MEETING: 'Họp lớp',
  PAY_FEE: 'Thu phí',
  ACADEMIC: 'Học tập',
};

export const columns: ColumnDef<AnnouncementResponse>[] = [
  {
    accessorKey: 'title',
    header: 'Tiêu đề',
    cell: ({ row }) => (
      <div className="flex max-w-[300px] flex-col">
        <Link 
          href={`/admin/announcements/${row.original.id}`}
          className="truncate font-medium hover:underline hover:text-primary transition-colors"
          title={row.original.title}
        >
          {row.original.title}
        </Link>
        <span className="text-muted-foreground truncate text-xs">
          Tạo bởi: {row.original.createdBy}
        </span>
      </div>
    ),
  },
  {
    accessorKey: 'announcementType',
    header: 'Loại tin',
    cell: ({ row }) => {
      const type = row.original.announcementType;
      return (
        <Badge variant="outline" className="whitespace-nowrap">
          {TYPE_MAP[type] || type}
        </Badge>
      );
    },
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
    accessorKey: 'announcementStatus',
    header: 'Trạng thái',
    cell: ({ row }) => {
      const isPublished = row.original.announcementStatus; // true = Released
      return (
        <Badge
          className={`${
            isPublished
              ? 'border-green-200 bg-green-500/15 text-green-700 hover:bg-green-500/25'
              : 'border-yellow-200 bg-yellow-500/15 text-yellow-700 hover:bg-yellow-500/25'
          }`}
          variant="outline"
        >
          {isPublished ? 'Đã phát hành' : 'Nháp'}
        </Badge>
      );
    },
  },
  {
    id: 'actions',
    header: 'Hành động',
    cell: ({ row }) => <ActionCell announcementResponse={row.original} />,
  },
];

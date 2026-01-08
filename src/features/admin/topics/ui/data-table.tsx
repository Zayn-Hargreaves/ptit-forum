// features/admin/topics/ui/data-table.tsx
'use client';

import {
  Button,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@shared/ui';
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';

import { TopicVisibility } from '@/entities/topic/model/types';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  loading: boolean;

  // Pagination (Server-side)
  pageCount: number;
  pageIndex: number;
  onPageChange: (page: number) => void;

  // Filters
  keyword: string;
  onKeywordChange: (val: string) => void;
  visibility: TopicVisibility | 'ALL';
  onVisibilityChange: (val: TopicVisibility | 'ALL') => void;
}

export function TopicDataTable<TData, TValue>({
  columns,
  data,
  loading,
  pageCount,
  pageIndex,
  onPageChange,
  keyword,
  onKeywordChange,
  visibility,
  onVisibilityChange,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    pageCount, // Báo cho table biết tổng số trang từ server
    state: {
      pagination: {
        pageIndex,
        pageSize: 10, // Cố định hoặc truyền từ props
      },
    },
    manualPagination: true, // Kích hoạt chế độ Server-side
    onPaginationChange: (updater) => {
      // Xử lý logic cập nhật pageIndex
      if (typeof updater === 'function') {
        const newState = updater({
          pageIndex,
          pageSize: 10,
        });
        onPageChange(newState.pageIndex);
      } else {
        onPageChange(updater.pageIndex);
      }
    },
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center gap-2">
        <Input
          placeholder="Tìm kiếm chủ đề..."
          value={keyword}
          onChange={(e) => onKeywordChange(e.target.value)}
          className="h-9 max-w-[300px]"
        />

        <Select
          value={visibility}
          onValueChange={(val) => onVisibilityChange(val as TopicVisibility | 'ALL')}
        >
          <SelectTrigger className="h-9 w-[180px]">
            <SelectValue placeholder="Chế độ hiển thị" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Tất cả</SelectItem>
            <SelectItem value="PUBLIC">Công khai</SelectItem>
            <SelectItem value="INTERNAL">Nội bộ</SelectItem>
            <SelectItem value="PRIVATE">Riêng tư</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="bg-background rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {loading && data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  Đang tải...
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  Không có dữ liệu.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="text-muted-foreground text-sm">
          Trang {table.getState().pagination.pageIndex + 1} / {Math.max(1, table.getPageCount())}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage() || loading}
        >
          Trước
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage() || loading}
        >
          Tiếp
        </Button>
      </div>
    </div>
  );
}

'use client';

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  PaginationState,
  useReactTable,
} from '@tanstack/react-table';

import { Button } from '@/shared/ui/button/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/ui/table/table';

import { UserSearchFormValues } from '../model/schema';
import { User } from '../model/types';
import { UserTableToolbar } from './user-table-toolbar';

interface UserTableProps {
  data: User[];
  columns: ColumnDef<User>[];
  pageCount: number;
  loading: boolean;
  onFiltersChange: (filters: UserSearchFormValues) => void;
  pagination: PaginationState;
  onPaginationChange: (pagination: PaginationState) => void;
}

export function UserTable({
  data,
  columns,
  loading,
  onFiltersChange,
  pageCount,
  pagination,
  onPaginationChange,
}: UserTableProps) {
  const table = useReactTable({
    data,
    columns,
    pageCount,
    state: { pagination },
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    manualSorting: true,
    onPaginationChange: (updater) =>
      onPaginationChange(typeof updater === 'function' ? updater(pagination) : updater),
  });

  return (
    <div className="space-y-4">
      <UserTableToolbar table={table} onFiltersChange={onFiltersChange} />
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  Đang tải dữ liệu...
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
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
                  Không tìm thấy người dùng nào.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage() || loading}
        >
          Trước
        </Button>
        <div className="text-sm">
          Trang {pagination.pageIndex + 1} / {Math.max(1, table.getPageCount())}
        </div>
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

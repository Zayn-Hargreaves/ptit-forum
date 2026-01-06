'use client';

import {
  Button,
  Input,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@shared/ui';
import { useQuery } from '@tanstack/react-query';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  PaginationState,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import { X } from 'lucide-react';

import { CohortCode } from '@/shared/api/classroom.service';
import { getAllFaculties } from '@/shared/api/faculty.service';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select/select'; // Giả định bạn có component Select

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  pageCount: number;
  pagination: PaginationState;
  onPaginationChange: (pagination: PaginationState) => void;
  sorting: SortingState;
  onSortingChange: (sorting: SortingState) => void;
  loading: boolean;
  onCreate: () => void;

  // --- Props cho Filters ---
  classCodeSearch: string;
  onClassCodeChange: (val: string) => void;

  selectedFaculty: string | undefined;
  onFacultyChange: (val: string | undefined) => void;

  selectedSchoolYear: CohortCode | undefined;
  onSchoolYearChange: (val: CohortCode | undefined) => void;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  pageCount,
  pagination,
  onPaginationChange,
  sorting,
  onSortingChange,
  loading,
  onCreate,
  classCodeSearch,
  onClassCodeChange,
  selectedFaculty,
  onFacultyChange,
  selectedSchoolYear,
  onSchoolYearChange,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    pageCount,
    state: { pagination, sorting },
    onPaginationChange: (updater) => {
      const nextState = typeof updater === 'function' ? updater(pagination) : updater;
      onPaginationChange(nextState);
    },
    onSortingChange: (updater) => {
      const nextState = typeof updater === 'function' ? updater(sorting) : updater;
      onSortingChange(nextState);
    },
    manualPagination: true,
    manualSorting: true,
    getCoreRowModel: getCoreRowModel(),
  });

  // Lấy danh sách khoa để đổ vào Dropdown Filter
  const { data: facultiesData } = useQuery({
    queryKey: ['all-faculties-filter'],
    queryFn: () => getAllFaculties({ page: 0, size: 100 }),
    staleTime: 1000 * 60 * 5, // Cache 5 phút
  });
  const faculties = facultiesData?.data || [];

  // Hàm reset filter
  const handleResetFilters = () => {
    onClassCodeChange('');
    onFacultyChange(undefined);
    onSchoolYearChange(undefined);
  };

  const hasActiveFilters = !!classCodeSearch || !!selectedFaculty || !!selectedSchoolYear;

  return (
    <div className="space-y-4">
      {/* Toolbar Filter */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        {/* Khu vực các bộ lọc */}
        <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center">
          {/* 1. Tìm theo Mã Lớp */}
          <Input
            placeholder="Tìm mã lớp..."
            value={classCodeSearch}
            onChange={(e) => onClassCodeChange(e.target.value)}
            className="h-9 w-full sm:w-[200px]"
          />

          {/* 2. Lọc theo Khoa */}
          <Select
            value={selectedFaculty || 'ALL'}
            onValueChange={(val) => onFacultyChange(val === 'ALL' ? undefined : val)}
          >
            <SelectTrigger className="h-9 w-full sm:w-[200px]">
              <SelectValue placeholder="Tất cả các khoa" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Tất cả các khoa</SelectItem>
              {faculties.map((f) => (
                <SelectItem key={f.id} value={f.id}>
                  {f.facultyName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* 3. Lọc theo Hệ (SchoolYearCode) */}
          <Select
            value={selectedSchoolYear || 'ALL'}
            onValueChange={(val) =>
              onSchoolYearChange(val === 'ALL' ? undefined : (val as CohortCode))
            }
          >
            <SelectTrigger className="h-9 w-full sm:w-[150px]">
              <SelectValue placeholder="Tất cả hệ" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Tất cả hệ</SelectItem>
              <SelectItem value="D">Đại học (D)</SelectItem>
              <SelectItem value="M">Cao học (M)</SelectItem>
              <SelectItem value="P">Tiến sĩ (P)</SelectItem>
              <SelectItem value="OTHER">Khác</SelectItem>
            </SelectContent>
          </Select>

          {/* Nút Xóa bộ lọc */}
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleResetFilters}
              className="h-9 px-2 lg:px-3"
            >
              Reset
              <X className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Các nút hành động bên phải */}
        <div className="flex items-center gap-2">
          <Button size="sm" onClick={onCreate}>
            + Thêm lớp
          </Button>
          <div className="flex items-center gap-1">
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
      </div>

      {/* Table UI */}
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
            {loading ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  Đang tải dữ liệu...
                </TableCell>
              </TableRow>
            ) : data.length > 0 ? (
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
                  Không tìm thấy lớp học nào.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Info Footer (Optional) */}
      <div className="text-muted-foreground text-right text-xs">
        Hiển thị trang {pagination.pageIndex + 1} trên tổng số {pageCount || 1}
      </div>
    </div>
  );
}

'use client';

import { columns, DataTable } from '@features/admin/faculties';
import { FacultyFormSheet } from '@features/admin/faculties/ui/faculty-form-sheet';
import { getAllFaculties } from '@shared/api/faculty.service';
import { useQuery } from '@tanstack/react-query';
import { PaginationState, SortingState } from '@tanstack/react-table';
import { useEffect, useState } from 'react';

import { useFacultyStore } from '@/features/admin/faculties/model/faculty-store';
import { Button } from '@/shared/ui/button/button';

/* ---------------- Debounce hook ---------------- */
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

/* ---------------- Page ---------------- */
export default function AdminFacultiesPage() {
  const { openCreate } = useFacultyStore();

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const [sorting, setSorting] = useState<SortingState>([]);
  const [search, setSearch] = useState('');

  const debouncedSearch = useDebounce(search, 500);

  // Reset page when search changes
  useEffect(() => {
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  }, [debouncedSearch]);

  const { data, isLoading } = useQuery({
    queryKey: [
      'admin-faculties',
      pagination.pageIndex,
      pagination.pageSize,
      sorting,
      debouncedSearch,
    ],
    queryFn: () =>
      getAllFaculties({
        page: pagination.pageIndex, // Spring Boot Default Pageable is 0-indexed
        size: pagination.pageSize,
        search: debouncedSearch || undefined,
      }),
  });

  const faculties = data?.data || [];
  const total = data?.total || 0;
  const pageCount = Math.ceil(total / pagination.pageSize);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Quản lý khoa</h2>
          <p className="text-muted-foreground">Quản lý danh sách các khoa trong hệ thống</p>
        </div>
        <Button onClick={openCreate}>+ Thêm khoa</Button>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={faculties}
        pageCount={pageCount}
        pagination={pagination}
        onPaginationChange={setPagination}
        sorting={sorting}
        onSortingChange={setSorting}
        search={search}
        onSearchChange={setSearch}
        loading={isLoading}
      />

      {/* Sheet */}
      <FacultyFormSheet />
    </div>
  );
}

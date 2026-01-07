'use client';

import { useQuery } from '@tanstack/react-query';
import { PaginationState, SortingState } from '@tanstack/react-table';
import { useEffect, useState } from 'react';

import { AnnouncementType } from '@/entities/announcement/model/types';
import {
  AnnouncementFormSheet,
  columns,
  DataTable,
  ReleaseDialog,
} from '@/features/admin/announcements'; // Import từ file index.ts đã tạo
import { useAnnouncementStore } from '@/features/admin/announcements/model/announcement-store';
import { announcementApi } from '@/shared/api/announcement.service';

// Simple Debounce Hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedValue;
}

export default function AdminAnnouncementsPage() {
  // Lấy action mở form tạo mới từ store
  const { openCreate } = useAnnouncementStore();

  /* ---------------- State Management ---------------- */
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const [sorting, setSorting] = useState<SortingState>([]);

  // Filter theo Loại thông báo (Thay vì Status như bên Document)
  const [typeFilter, setTypeFilter] = useState<AnnouncementType | 'ALL'>('ALL');

  // Search theo Title
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 500);

  /* ---------------- Effects ---------------- */
  // Reset về trang 1 khi thay đổi bộ lọc hoặc tìm kiếm
  useEffect(() => {
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  }, [typeFilter, debouncedSearch]);

  /* ---------------- Query Data ---------------- */
  const { data, isLoading } = useQuery({
    queryKey: [
      'admin-announcements',
      pagination.pageIndex,
      pagination.pageSize,
      sorting,
      typeFilter,
      debouncedSearch,
    ],
    queryFn: () =>
      announcementApi.search({
        page: pagination.pageIndex, // Spring Boot (0-based)
        size: pagination.pageSize,
        title: debouncedSearch || undefined,
        type: typeFilter === 'ALL' ? undefined : typeFilter,
        // Nếu backend hỗ trợ sort:
        // sort: sorting.length > 0 ? `${sorting[0].id},${sorting[0].desc ? 'desc' : 'asc'}` : undefined
      }),
  });

  const announcements = data?.data || [];
  const total = data?.total || 0;
  const pageCount = Math.ceil(total / pagination.pageSize);

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Quản lý thông báo</h2>
        <p className="text-muted-foreground">
          Tạo mới, chỉnh sửa và phát hành thông báo đến sinh viên.
        </p>
      </div>
      {/* Data Table */}
      <DataTable
        columns={columns}
        data={announcements}
        pageCount={pageCount}
        pagination={pagination}
        onPaginationChange={setPagination}
        sorting={sorting}
        onSortingChange={setSorting}
        // Các props filter dành riêng cho Announcement
        search={search}
        onSearchChange={setSearch}
        typeFilter={typeFilter}
        onTypeFilterChange={setTypeFilter}
        loading={isLoading}
        onCreate={openCreate} // Nút "+ Tạo thông báo"
      />
      {/* Các Modal/Sheet xử lý hành động */}
      <AnnouncementFormSheet /> {/* Form Create/Edit */}
      <ReleaseDialog /> {/* Dialog Phát hành */}
    </div>
  );
}

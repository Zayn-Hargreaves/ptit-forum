'use client';

import { useQuery } from '@tanstack/react-query';
import { PaginationState, SortingState } from '@tanstack/react-table';
import { useEffect, useState } from 'react';

import { useClassroomStore } from '@/features/admin/classrooms/model/classroom-store';
import { ClassroomFormSheet } from '@/features/admin/classrooms/ui/classroom-form-sheet';
import { columns } from '@/features/admin/classrooms/ui/columns';
import { DataTable } from '@/features/admin/classrooms/ui/data-table'; // Import component mới
import { CohortCode, searchAllClassrooms } from '@/shared/api/classroom.service';

/* ---------------- Debounce hook ---------------- */
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

export default function AdminClassroomsPage() {
  const { openCreate } = useClassroomStore();

  /* --- State cho Pagination & Sorting --- */
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState<SortingState>([]);

  /* --- State cho Filters (mapping với Params API) --- */
  const [searchCode, setSearchCode] = useState(''); // mapping: classCode
  const [selectedFaculty, setSelectedFaculty] = useState<string | undefined>(undefined); // mapping: facultyId
  const [selectedSchoolYear, setSelectedSchoolYear] = useState<CohortCode | undefined>(undefined); // mapping: schoolYearCode

  const debouncedSearchCode = useDebounce(searchCode, 500);

  // Reset về trang 1 khi bất kỳ filter nào thay đổi
  useEffect(() => {
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  }, [debouncedSearchCode, selectedFaculty, selectedSchoolYear]);

  /* --- Query Data --- */
  const { data, isLoading } = useQuery({
    queryKey: [
      'admin-classrooms',
      pagination.pageIndex,
      pagination.pageSize,
      sorting,
      debouncedSearchCode,
      selectedFaculty,
      selectedSchoolYear,
    ],
    queryFn: () =>
      searchAllClassrooms({
        page: pagination.pageIndex + 1, // API spring boot page start from 1? Nếu 0 thì bỏ +1
        size: pagination.pageSize,
        classCode: debouncedSearchCode || undefined,
        facultyId: selectedFaculty,
        schoolYearCode: selectedSchoolYear,
      }),
  });

  const classrooms = data?.data || [];
  const total = data?.total || 0;
  const pageCount = Math.ceil(total / pagination.pageSize);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Quản lý lớp hành chính</h2>
          <p className="text-muted-foreground">Danh sách các lớp niên chế theo khoa và khóa học</p>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={classrooms}
        pageCount={pageCount}
        pagination={pagination}
        onPaginationChange={setPagination}
        sorting={sorting}
        onSortingChange={setSorting}
        loading={isLoading}
        onCreate={openCreate}
        // Pass props Filter
        classCodeSearch={searchCode}
        onClassCodeChange={setSearchCode}
        selectedFaculty={selectedFaculty}
        onFacultyChange={setSelectedFaculty}
        selectedSchoolYear={selectedSchoolYear}
        onSchoolYearChange={setSelectedSchoolYear}
      />

      <ClassroomFormSheet />
    </div>
  );
}

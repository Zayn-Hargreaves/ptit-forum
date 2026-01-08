'use client';

import { columns, DataTable, SubjectFormSheet, useSubjectStore } from '@features/admin/subjects';
import { useQuery } from '@tanstack/react-query';
import { PaginationState } from '@tanstack/react-table';
import { useState } from 'react';

import { subjectApi } from '@/shared/api/subject.service';

export default function AdminSubjectPage() {
  const { openCreate } = useSubjectStore();

  // States cho filter & pagination
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [searchName, setSearchName] = useState('');

  // Fetch API
  const { data, isLoading } = useQuery({
    queryKey: ['admin-subjects', pagination.pageIndex, pagination.pageSize, searchName],
    queryFn: () =>
      subjectApi.search({
        page: pagination.pageIndex,
        size: pagination.pageSize,
        subjectName: searchName || undefined,
        // facultyId, semesterId, cohortCode có thể thêm vào đây nếu mở rộng filter UI
      }),
  });

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Quản lý môn học</h1>
      </div>

      <DataTable
        columns={columns}
        data={data?.data || []}
        pageCount={data ? Math.ceil(data.total / pagination.pageSize) : 0}
        pagination={pagination}
        onPaginationChange={setPagination}
        searchName={searchName}
        onSearchNameChange={setSearchName}
        loading={isLoading}
        onCreate={openCreate}
      />

      <SubjectFormSheet />
    </div>
  );
}

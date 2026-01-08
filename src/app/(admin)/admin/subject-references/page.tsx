'use client';

import {
  columns,
  DataTable,
  SubjectReferenceFormSheet,
  useSubjectReferenceStore,
} from '@features/admin/subject-references';
import { CohortCode } from '@shared/api/classroom.service';
import { subjectReferenceApi } from '@shared/api/subject-reference.service';
import { useQuery } from '@tanstack/react-query';
import { PaginationState } from '@tanstack/react-table';
import { useState } from 'react';

export default function AdminSubjectReferencePage() {
  const { openCreate } = useSubjectReferenceStore();

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [selectedCohort, setSelectedCohort] = useState<CohortCode | 'ALL'>('ALL');

  const { data, isLoading } = useQuery({
    queryKey: [
      'admin-subject-references',
      pagination.pageIndex,
      pagination.pageSize,
      selectedCohort,
    ],
    queryFn: () =>
      subjectReferenceApi.search({
        page: pagination.pageIndex,
        size: pagination.pageSize,
        cohortCode: selectedCohort === 'ALL' ? undefined : selectedCohort,
      }),
  });

  return (
    <div className="container mx-auto py-6">
      <h1 className="mb-6 text-2xl font-bold tracking-tight">Quản lý tham chiếu môn học</h1>

      <DataTable
        columns={columns}
        data={data?.data || []}
        pageCount={data ? Math.ceil(data.total / pagination.pageSize) : 0}
        pagination={pagination}
        onPaginationChange={setPagination}
        loading={isLoading}
        onCreate={openCreate}
        selectedCohort={selectedCohort}
        onCohortChange={setSelectedCohort}
      />

      <SubjectReferenceFormSheet />
    </div>
  );
}

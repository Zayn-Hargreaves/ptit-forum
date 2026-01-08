// features/admin/topics/ui/admin-topics-page.tsx (hoặc file index.ts của page)
'use client';

import { keepPreviousData, useQuery } from '@tanstack/react-query'; // Import keepPreviousData
import { useState } from 'react';

import { TopicVisibility } from '@/entities/topic/model/types';
import { columns, TopicDataTable, TopicDetailSheet } from '@/features/admin/topics';
import { topicApi } from '@/shared/api/topic.service';

export default function AdminTopicsPage() {
  /* ---------------- Search / Filter State ---------------- */
  const [keyword, setKeyword] = useState('');
  const [visibility, setVisibility] = useState<TopicVisibility | 'ALL'>('ALL'); // Sửa undefined thành "ALL" cho dễ xử lý UI
  const [page, setPage] = useState(0); // Page bắt đầu từ 0 (theo logic của React Table)
  const size = 10;

  /* ---------------- Query Data ---------------- */
  const { data, isLoading } = useQuery({
    // Thêm các dependency vào queryKey để tự động refetch khi state đổi
    queryKey: ['admin-topics', page, size, keyword, visibility],
    queryFn: () =>
      topicApi.search({
        page: page, // API Spring Boot uses 0-based indexing
        size,
        keyword: keyword || undefined,
        visibility: visibility === 'ALL' ? undefined : visibility,
      }),
    placeholderData: keepPreviousData, // FIX: Thay keepPreviousData: true bằng cái này
  });

  const topics = data?.data || [];
  const total = data?.total || 0;
  const pageCount = Math.ceil(total / size);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Quản lý Topic</h2>
        <p className="text-muted-foreground">
          Quản lý các bài viết và chủ đề thảo luận trong diễn đàn.
        </p>
      </div>

      {/* Data Table */}
      <TopicDataTable
        columns={columns}
        data={topics}
        loading={isLoading}
        // Pagination Props
        pageCount={pageCount}
        pageIndex={page}
        onPageChange={setPage}
        // Filter Props
        keyword={keyword}
        onKeywordChange={setKeyword}
        visibility={visibility}
        onVisibilityChange={setVisibility}
      />
      <TopicDetailSheet />
    </div>
  );
}

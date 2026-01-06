'use client';

import { PaginationState } from '@tanstack/react-table';
import { useQuery } from '@tanstack/react-query';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useCallback, useMemo } from 'react';

import { getUsers } from '@/features/admin/users/api/user.service';
import { UserSearchFormValues } from '@/features/admin/users/model/schema';
import { SearchUserParams } from '@/features/admin/users/model/types';
import { columns } from '@/features/admin/users/ui/columns';
import { UserTable } from '@/features/admin/users/ui/user-table';
import { Heading } from '@/shared/ui/heading/heading';
import { Separator } from '@/shared/ui/separator/separator';

function UsersPageContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Extract params
  const page = Number(searchParams.get('page')) || 1;
  const size = Number(searchParams.get('size')) || 10;
  
  const queryParams: SearchUserParams = useMemo(() => {
    return {
      page: page - 1, // API is 0-indexed usually, but let's check. Java Pageable is 0-indexed.
                      // URL page=1 means index 0.
      size,
      email: searchParams.get('email') || undefined,
      fullName: searchParams.get('fullName') || undefined,
      studentCode: searchParams.get('studentCode') || undefined,
      classCode: searchParams.get('classCode') || undefined,
      enable: searchParams.get('enable') === 'true' ? true : searchParams.get('enable') === 'false' ? false : undefined,
    };
  }, [searchParams, page, size]);

  // Debug log
  console.log('UsersPage QueryParams:', queryParams);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-users', queryParams],
    queryFn: () => getUsers(queryParams),
    placeholderData: (previousData) => previousData,
  });

  const handleFiltersChange = useCallback(
    (values: UserSearchFormValues) => {
      const params = new URLSearchParams(searchParams.toString());
      
      // Reset to page 1 on filter change
      params.set('page', '1');

      // Utility to clean empty/undefined values
      const cleanSet = (key: string, value: string | undefined | null) => {
        if (value && value.trim() !== '' && value !== 'all') {
          params.set(key, value.trim());
        } else {
          params.delete(key);
        }
      };

      cleanSet('email', values.email);
      cleanSet('fullName', values.fullName);
      cleanSet('studentCode', values.studentCode);
      cleanSet('classCode', values.classCode);
      cleanSet('enable', values.enable);

      router.push(`${pathname}?${params.toString()}`);
    },
    [pathname, router, searchParams]
  );

  const handlePaginationChange = useCallback(
    (pagination: PaginationState) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set('page', (pagination.pageIndex + 1).toString());
      params.set('size', pagination.pageSize.toString());
      router.push(`${pathname}?${params.toString()}`);
    },
    [pathname, router, searchParams]
  );

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <Heading title={`Quản lý người dùng (${data?.meta.total || 0})`} description="Quản lý danh sách người dùng, sinh viên trong hệ thống" />
      </div>
      <Separator />
      
      <UserTable
        data={data?.data || []}
        columns={columns}
        loading={isLoading}
        pageCount={data?.meta.totalPages || 1}
        onFiltersChange={handleFiltersChange}
        pagination={{ pageIndex: page - 1, pageSize: size }}
        onPaginationChange={handlePaginationChange}
      />
    </div>
  );
}

export default function UsersPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <UsersPageContent />
    </Suspense>
  );
}

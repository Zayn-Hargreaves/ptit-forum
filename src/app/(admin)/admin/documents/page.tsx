"use client";

import { useQuery } from "@tanstack/react-query";
import { adminSearchDocuments } from "@shared/api/document.service";
import { DataTable, columns } from "@features/admin/documents";
import { useState, useEffect } from "react";
import { PaginationState, SortingState } from "@tanstack/react-table";

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

export default function AdminDocumentsPage() {
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    });
    const [sorting, setSorting] = useState<SortingState>([]);
    const [statusFilter, setStatusFilter] = useState("PENDING");
    const [search, setSearch] = useState("");
    const debouncedSearch = useDebounce(search, 500);

    // Reset pagination when filter/search changes
    useEffect(() => {
        setPagination(prev => ({ ...prev, pageIndex: 0 }));
    }, [statusFilter, debouncedSearch]);

    const { data, isLoading } = useQuery({
        queryKey: ['admin-documents', pagination.pageIndex, pagination.pageSize, statusFilter, sorting, debouncedSearch],
        queryFn: () => adminSearchDocuments({
            page: pagination.pageIndex + 1,
            limit: pagination.pageSize,
            status: statusFilter === "ALL" ? undefined : statusFilter,
            keyword: debouncedSearch || undefined,
            sort: sorting.length > 0 ? `${sorting[0].id},${sorting[0].desc ? 'desc' : 'asc'}` : undefined
        }),
    });

    const documents = data?.data || [];
    const total = data?.total || 0;
    const pageCount = Math.ceil(total / pagination.pageSize);

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">Admin Documents</h2>
                <p className="text-muted-foreground">Manage and approve uploaded documents.</p>
            </div>

            <DataTable
                columns={columns}
                data={documents}
                pageCount={pageCount}
                pagination={pagination}
                onPaginationChange={setPagination}
                sorting={sorting}
                onSortingChange={setSorting}
                statusFilter={statusFilter}
                onStatusFilterChange={setStatusFilter}
                search={search}
                onSearchChange={setSearch}
                loading={isLoading}
            />
        </div>
    );
}

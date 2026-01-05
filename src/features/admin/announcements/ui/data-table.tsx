"use client";

import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
    PaginationState,
    SortingState,
} from "@tanstack/react-table";

import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
    Button, Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@shared/ui";
import { AnnouncementType } from "@entities/announcement/model/types";

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    pageCount: number;
    pagination: PaginationState;
    onPaginationChange: (pagination: PaginationState) => void;
    sorting: SortingState;
    onSortingChange: (sorting: SortingState) => void;

    // Filters
    search: string;
    onSearchChange: (val: string) => void;
    typeFilter: AnnouncementType | "ALL";
    onTypeFilterChange: (val: AnnouncementType | "ALL") => void;

    loading: boolean;
    onCreate: () => void;
}

export function DataTable<TData, TValue>({
                                             columns,
                                             data,
                                             pageCount,
                                             pagination,
                                             onPaginationChange,
                                             sorting,
                                             onSortingChange,
                                             search,
                                             onSearchChange,
                                             typeFilter,
                                             onTypeFilterChange,
                                             loading,
                                             onCreate
                                         }: DataTableProps<TData, TValue>) {

    const table = useReactTable({
        data,
        columns,
        pageCount,
        state: { pagination, sorting },
        manualPagination: true,
        manualSorting: true,
        getCoreRowModel: getCoreRowModel(),
        onPaginationChange: (updater) => onPaginationChange(typeof updater === 'function' ? updater(pagination) : updater),
        onSortingChange: (updater) => onSortingChange(typeof updater === 'function' ? updater(sorting) : updater),
    });

    return (
        <div className="space-y-4">
            {/* Toolbar */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <Input
                        placeholder="Tìm kiếm tiêu đề..."
                        value={search}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="w-[250px] h-9"
                    />

                    <Select value={typeFilter} onValueChange={(val) => onTypeFilterChange(val as AnnouncementType | "ALL")}>
                        <SelectTrigger className="w-[180px] h-9">
                            <SelectValue placeholder="Loại thông báo" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ALL">Tất cả loại</SelectItem>
                            <SelectItem value="ACADEMIC">Học tập</SelectItem>
                            <SelectItem value="ACTIVITY">Hoạt động</SelectItem>
                            <SelectItem value="TUITION">Học phí</SelectItem>
                            <SelectItem value="OTHER">Khác</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex items-center space-x-2">
                    <Button onClick={onCreate} size="sm">+ Tạo thông báo</Button>

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

            {/* Table */}
            <div className="rounded-md border bg-background">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {loading && data.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">Đang tải...</TableCell>
                            </TableRow>
                        ) : table.getRowModel().rows.length ? (
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
                                <TableCell colSpan={columns.length} className="h-24 text-center">Không có dữ liệu.</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
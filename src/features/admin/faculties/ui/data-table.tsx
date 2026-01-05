"use client";

import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    PaginationState,
    SortingState,
    useReactTable,
} from "@tanstack/react-table";

import {Button, Input, Table, TableBody, TableCell, TableHead, TableHeader, TableRow,} from "@shared/ui";

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    pageCount: number;
    pagination: PaginationState;
    onPaginationChange: (pagination: PaginationState) => void;
    sorting: SortingState;
    onSortingChange: (sorting: SortingState) => void;
    search: string;
    onSearchChange: (val: string) => void;
    loading: boolean;
    onCreate?: () => void;
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
                                                    loading,
                                                    onCreate,
                                                }: DataTableProps<TData, TValue>) {

    const table = useReactTable({
        data,
        columns,
        pageCount,
        state: {
            pagination,
            sorting,
        },
        onPaginationChange: (updater) => {
            if (typeof updater === "function") {
                onPaginationChange(updater(pagination));
            } else {
                onPaginationChange(updater);
            }
        },
        onSortingChange: (updater) => {
            if (typeof updater === "function") {
                onSortingChange(updater(sorting));
            } else {
                onSortingChange(updater);
            }
        },
        manualPagination: true,
        manualSorting: true,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <div className="space-y-4">
            {/* Toolbar */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <Input
                        placeholder="Tìm theo tên hoặc mã khoa..."
                        value={search}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="w-[250px] h-8"
                    />
                </div>

                <div className="flex items-center space-x-2">
                    {onCreate && (
                        <Button size="sm" onClick={onCreate}>
                            + Thêm khoa
                        </Button>
                    )}

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
            <div className="rounded-md border">
                <Table>
                    <TableHeader className="sticky top-0 bg-background z-10">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>

                    <TableBody>
                        {loading && data.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    Đang tải...
                                </TableCell>
                            </TableRow>
                        ) : table.getRowModel().rows.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id}>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    Không có khoa nào.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}

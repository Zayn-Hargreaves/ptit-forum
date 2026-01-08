// features/admin/categories/ui/data-table.tsx
"use client";

import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
    getPaginationRowModel,
    getFilteredRowModel, // Import hàm filter core
    ColumnFiltersState,  // Type cho state filter
} from "@tanstack/react-table";

import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
    Button, Input,
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue // Import Select component
} from "@shared/ui";
import { useState } from "react";
import { CategoryType } from "@/entities/category/model/types";

// Map label hiển thị cho bộ lọc
const TYPE_LABEL: Record<CategoryType, string> = {
    [CategoryType.ACADEMIC]: "Học tập",
    [CategoryType.CLASSROOM]: "Lớp học",
    [CategoryType.CLUB]: "Câu lạc bộ",
    [CategoryType.LIFE]: "Đời sống",
};

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    loading: boolean;
    onCreate: () => void;
}

export function CategoryDataTable<TData, TValue>({
                                                     columns,
                                                     data,
                                                     loading,
                                                     onCreate
                                                 }: DataTableProps<TData, TValue>) {

    // State 1: Global Filter (Search text chung)
    const [globalFilter, setGlobalFilter] = useState("");

    // State 2: Column Filter (Bộ lọc riêng cho từng cột, ở đây dùng cho categoryType)
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getFilteredRowModel: getFilteredRowModel(), // Kích hoạt tính năng filter
        state: {
            globalFilter,
            columnFilters, // Truyền state vào table
        },
        onGlobalFilterChange: setGlobalFilter,
        onColumnFiltersChange: setColumnFilters,
        initialState: {
            pagination: {
                pageSize: 10, // Mặc định 10 dòng/trang
            }
        }
    });

    // Hàm xử lý khi chọn Filter từ Dropdown
    const handleTypeFilterChange = (value: string) => {
        // Lấy column theo accessorKey đã định nghĩa trong columns.tsx
        const column = table.getColumn("categoryType");

        if (value === "ALL") {
            column?.setFilterValue(undefined); // Xóa filter để hiện tất cả
        } else {
            column?.setFilterValue(value);     // Filter theo giá trị Enum
        }
    };

    // Lấy giá trị filter hiện tại để hiển thị lên Select (UI)
    const currentFilterValue = (table.getColumn("categoryType")?.getFilterValue() as string) || "ALL";

    return (
        <div className="space-y-4">
            {/* Toolbar Area */}
            <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 flex-1">
                    {/* 1. Ô tìm kiếm Text */}
                    <Input
                        placeholder="Tìm kiếm danh mục..."
                        value={globalFilter ?? ""}
                        onChange={(e) => setGlobalFilter(e.target.value)}
                        className="max-w-[300px] h-9"
                    />

                    {/* 2. Dropdown Lọc theo Loại */}
                    <Select
                        value={currentFilterValue}
                        onValueChange={handleTypeFilterChange}
                    >
                        <SelectTrigger className="w-[200px] h-9">
                            <SelectValue placeholder="Lọc theo loại" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ALL">Tất cả loại</SelectItem>
                            <SelectItem value={CategoryType.ACADEMIC}>{TYPE_LABEL[CategoryType.ACADEMIC]}</SelectItem>
                            <SelectItem value={CategoryType.CLASSROOM}>{TYPE_LABEL[CategoryType.CLASSROOM]}</SelectItem>
                            <SelectItem value={CategoryType.CLUB}>{TYPE_LABEL[CategoryType.CLUB]}</SelectItem>
                            <SelectItem value={CategoryType.LIFE}>{TYPE_LABEL[CategoryType.LIFE]}</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <Button onClick={onCreate} size="sm">+ Tạo danh mục</Button>
            </div>

            {/* Table Area */}
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
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    Đang tải dữ liệu...
                                </TableCell>
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
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    Không có dữ liệu phù hợp.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center justify-end space-x-2 py-4">
                <div className="text-sm text-muted-foreground">
                    Trang {table.getState().pagination.pageIndex + 1} / {Math.max(1, table.getPageCount())}
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                >
                    Trước
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                >
                    Tiếp
                </Button>
            </div>
        </div>
    );
}
"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
    PaginationState,
    SortingState,
} from "@tanstack/react-table";
import { Document } from "@entities/document/model/schema";
import { getMyDocuments, deleteDocument, GetDocumentsParams } from "@shared/api/document.service";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
    Button,
    Input,
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    Badge,
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@shared/ui";
import { format } from "date-fns";
import Image from "next/image";
import { MoreHorizontal, Pencil, Trash2, Eye, Download, AlertCircle, Info } from "lucide-react";
import { toast } from "sonner";
import { EditDocumentDialog } from "./edit-document-dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@shared/ui/dropdown-menu/dropdown-menu";

export function UserDocumentsTable() {
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    });
    const [statusFilter, setStatusFilter] = useState("ALL");
    const [search, setSearch] = useState("");
    const [sorting, setSorting] = useState<SortingState>([]);
    const [editingDoc, setEditingDoc] = useState<Document | null>(null);

    const queryClient = useQueryClient();

    // Fetch Documents
    const { data, isLoading } = useQuery({
        queryKey: ["my-documents", pagination, statusFilter, search, sorting],
        queryFn: () =>
            getMyDocuments({
                page: pagination.pageIndex + 1,
                limit: pagination.pageSize,
                status: statusFilter === "ALL" ? undefined : statusFilter,
                keyword: search || undefined,
                sort: sorting.length > 0 ? `${sorting[0].id},${sorting[0].desc ? 'desc' : 'asc'}` : undefined,
            }),
    });

    const documents = data?.data || [];
    const pageCount = data?.total ? Math.ceil(data.total / pagination.pageSize) : 0;

    // Delete Mutation
    const deleteMutation = useMutation({
        mutationFn: deleteDocument,
        onSuccess: () => {
            toast.success("Document deleted successfully");
            queryClient.invalidateQueries({ queryKey: ["my-documents"] });
        },
        onError: (error: any) => {
            console.error(error); // Log for debugging
            toast.error(error.message || "Failed to delete document");
        },
    });

    const handleDelete = (id: string) => {
        if (confirm("Are you sure you want to delete this document? This action cannot be undone.")) {
            deleteMutation.mutate(id);
        }
    };

    const columns: ColumnDef<Document>[] = [
        {
            accessorKey: "thumbnailUrl",
            header: "Thumbnail",
            cell: ({ row }) => (
                <div className="relative h-12 w-12 overflow-hidden rounded-md border min-w-[3rem]">
                    <Image
                        src={row.original.thumbnailUrl}
                        alt={row.original.title}
                        fill
                        className="object-cover"
                        sizes="48px"
                    />
                </div>
            ),
        },
        {
            accessorKey: "title",
            header: "Title",
            cell: ({ row }) => (
                <div className="flex flex-col max-w-[200px]">
                    <span className="font-medium truncate" title={row.original.title}>
                        {row.original.title}
                    </span>
                    <span className="text-xs text-muted-foreground truncate">
                        {(() => {
                            if (!row.original.uploadDate) return "-";
                            const date = new Date(row.original.uploadDate);
                            return !isNaN(date.getTime()) ? format(date, "MMM dd, yyyy") : "-";
                        })()}
                    </span>
                </div>
            ),
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => {
                const originalStatus = row.original.status || 'PENDING';
                const status = originalStatus.toUpperCase();

                // Mock rejection reason if not present in schema (assuming backend might send it in future or we need to fetch detail)
                // Ideally schema should have `rejectionReason`. For now simulating logic.
                const rejectionReason = (row.original as any).rejectionReason || "Common issues: Low quality content or copyright violation.";

                const config: Record<string, { label: string; className: string }> = {
                    PENDING: { label: "Pending", className: "bg-yellow-500/15 text-yellow-700 border-yellow-200" },
                    PUBLISHED: { label: "Published", className: "bg-green-500/15 text-green-700 border-green-200" },
                    PROCESSING: { label: "Processing", className: "bg-blue-500/15 text-blue-700 border-blue-200" },
                    REJECTED: { label: "Rejected", className: "bg-destructive/15 text-destructive border-destructive/20" },
                    FAILED: { label: "Failed", className: "bg-destructive/15 text-destructive border-destructive/20" },
                };
                const statusConfig = config[status] || { label: status, className: "bg-muted text-muted-foreground" };

                return (
                    <div className="flex items-center gap-2">
                        <Badge variant="outline" className={statusConfig.className}>
                            {statusConfig.label}
                        </Badge>
                        {status === "REJECTED" && (
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive hover:bg-destructive/10 rounded-full">
                                        <AlertCircle className="h-4 w-4" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-80">
                                    <div className="space-y-2">
                                        <h4 className="font-medium leading-none text-destructive flex items-center gap-2">
                                            <AlertCircle className="h-4 w-4" />
                                            Rejection Reason
                                        </h4>
                                        <p className="text-sm text-muted-foreground">
                                            {rejectionReason}
                                        </p>
                                    </div>
                                </PopoverContent>
                            </Popover>
                        )}
                    </div>
                );
            },
        },
        {
            id: "stats",
            header: "Stats",
            cell: ({ row }) => (
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                        <Eye className="h-3 w-3" /> {row.original.viewCount || 0}
                    </div>
                    <div className="flex items-center gap-1">
                        <Download className="h-3 w-3" /> {row.original.downloadCount || 0}
                    </div>
                </div>
            )
        },
        {
            id: "actions",
            cell: ({ row }) => {
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => setEditingDoc(row.original)}>
                                <Pencil className="mr-2 h-4 w-4" /> Edit Metadata
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onClick={() => handleDelete(row.original.id)}
                                className="text-destructive focus:text-destructive"
                            >
                                <Trash2 className="mr-2 h-4 w-4" /> Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        },
    ];

    const table = useReactTable({
        data: documents,
        columns,
        pageCount: pageCount,
        state: {
            pagination,
            sorting
        },
        onPaginationChange: setPagination,
        onSortingChange: setSorting,
        manualPagination: true,
        manualSorting: true,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Input
                        placeholder="Search documents..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-[200px] h-9"
                    />
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-[150px] h-9">
                            <SelectValue placeholder="All Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ALL">All Status</SelectItem>
                            <SelectItem value="PUBLISHED">Published</SelectItem>
                            <SelectItem value="PENDING">Pending</SelectItem>
                            <SelectItem value="REJECTED">Rejected</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="rounded-md border bg-background">
                <Table>
                    <TableHeader className="sticky top-0 bg-background z-10">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">Loading...</TableCell>
                            </TableRow>
                        ) : table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
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
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    No documents found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <div className="flex items-center justify-end space-x-2 py-4">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                >
                    Previous
                </Button>
                <div className="text-sm font-medium">
                    Page {pagination.pageIndex + 1} of {Math.max(1, pageCount)}
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                >
                    Next
                </Button>
            </div>

            {editingDoc && (
                <EditDocumentDialog
                    document={editingDoc}
                    open={!!editingDoc}
                    onOpenChange={(open) => !open && setEditingDoc(null)}
                />
            )}
        </div>
    );
}

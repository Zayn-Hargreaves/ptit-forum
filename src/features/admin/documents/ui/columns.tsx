import { ColumnDef } from "@tanstack/react-table";
import { Document } from "@entities/document/model/schema";
import { Badge } from "@shared/ui";
import { ActionCell } from "./action-cell";
import Image from "next/image";
import { format } from "date-fns";

export const columns: ColumnDef<Document>[] = [
    {
        accessorKey: "thumbnailUrl",
        header: "Ảnh đại diện",
        cell: ({ row }) => (
            <div className="relative h-12 w-12 overflow-hidden rounded-md border min-w-[3rem]">
                <Image
                    src={row.original.thumbnailUrl}
                    alt={row.original.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
            </div>
        ),
    },
    {
        accessorKey: "title",
        header: "Tài liệu",
        cell: ({ row }) => (
            <div className="flex flex-col">
                <span className="font-medium truncate max-w-[200px]" title={row.original.title}>{row.original.title}</span>
                <div className="flex items-center text-sm text-muted-foreground mt-1">
                    <div className="relative h-4 w-4 mr-2 rounded-full overflow-hidden shrink-0">
                        <Image src={row.original.author.avatar} alt="Author" fill className="object-cover" />
                    </div>
                    <span className="truncate max-w-[150px]">{row.original.author.name}</span>
                </div>
            </div>
        ),
    },
    {
        accessorKey: "uploadDate",
        header: "Ngày tải lên",
        cell: ({ row }) => {
            if (!row.original.uploadDate) return <span className="text-sm text-muted-foreground">-</span>;
            const date = new Date(row.original.uploadDate);
            return <span className="text-sm text-muted-foreground">{!isNaN(date.getTime()) ? format(date, "dd/MM/yyyy HH:mm") : "Ngày không hợp lệ"}</span>;
        },
    },
    {
        accessorKey: "status",
        header: "Trạng thái",
        cell: ({ row }) => {
            const status = row.original.status.toUpperCase(); // Ensure uppercase

            const config: Record<string, { label: string; className: string }> = {
                PENDING: { label: "Chờ duyệt", className: "bg-yellow-500/15 text-yellow-700 hover:bg-yellow-500/25 border-yellow-200" },
                PUBLISHED: { label: "Đã xuất bản", className: "bg-green-500/15 text-green-700 hover:bg-green-500/25 border-green-200" },
                PROCESSING: { label: "Đang xử lý", className: "bg-blue-500/15 text-blue-700 hover:bg-blue-500/25 border-blue-200" },
                REJECTED: { label: "Đã từ chối", className: "bg-red-500/15 text-red-700 hover:bg-red-500/25 border-red-200" },
                FAILED: { label: "Thất bại", className: "bg-destructive/15 text-destructive hover:bg-destructive/25 border-destructive/20" },
            };

            const statusConfig = config[status] || { label: status, className: "bg-gray-500/15 text-gray-700" };

            return (
                <Badge variant="outline" className={`${statusConfig.className} border`}>
                    {statusConfig.label}
                </Badge>
            );
        },
    },
    {
        id: "actions",
        cell: ({ row }) => <ActionCell document={row.original} />
    },
];

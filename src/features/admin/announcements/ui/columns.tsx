import { ColumnDef } from "@tanstack/react-table";
import {AnnouncementResponse} from "@entities/announcement/model/types";
import { Badge, Button } from "@shared/ui";
import { format } from "date-fns";
import { ActionCell } from "./action-cell";

// Map Enum Backend sang Tiếng Việt
const TYPE_MAP: Record<string, string> = {
    ACADEMIC: "Học tập",
    ACTIVITY: "Hoạt động",
    TUITION: "Học phí",
    OTHER: "Khác",
};

export const columns: ColumnDef<AnnouncementResponse>[] = [
    {
        accessorKey: "title",
        header: "Tiêu đề",
        cell: ({ row }) => (
            <div className="flex flex-col max-w-[300px]">
                <span className="font-medium truncate" title={row.original.title}>
                    {row.original.title}
                </span>
                <span className="text-xs text-muted-foreground truncate">
                    Tạo bởi: {row.original.createdBy}
                </span>
            </div>
        ),
    },
    {
        accessorKey: "announcementType",
        header: "Loại tin",
        cell: ({ row }) => {
            const type = row.original.announcementType;
            return (
                <Badge variant="outline" className="whitespace-nowrap">
                    {TYPE_MAP[type] || type}
                </Badge>
            );
        },
    },
    {
        accessorKey: "createdDate",
        header: "Ngày tạo",
        cell: ({ row }) => {
            if (!row.original.createdDate) return <span>-</span>;
            const date = new Date(row.original.createdDate);
            return <span className="text-sm text-muted-foreground">{format(date, "dd/MM/yyyy")}</span>;
        },
    },
    {
        accessorKey: "announcementStatus",
        header: "Trạng thái",
        cell: ({ row }) => {
            const isPublished = row.original.announcementStatus; // true = Released
            return (
                <Badge
                    className={`${
                        isPublished
                            ? "bg-green-500/15 text-green-700 border-green-200 hover:bg-green-500/25"
                            : "bg-yellow-500/15 text-yellow-700 border-yellow-200 hover:bg-yellow-500/25"
                    }`}
                    variant="outline"
                >
                    {isPublished ? "Đã phát hành" : "Nháp"}
                </Badge>
            );
        },
    },
    {
        id: "actions",
        header: "Hành động",
        cell: ({ row }) => <ActionCell announcementResponse={row.original} />
    },
];
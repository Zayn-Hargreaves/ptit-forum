import { ColumnDef } from "@tanstack/react-table";
import { TopicResponse, TopicVisibility } from "@/entities/topic/model/types";
import { Badge } from "@shared/ui";
import { format } from "date-fns";
import { ActionCell } from "./action-cell";

const VISIBILITY_LABEL: Record<TopicVisibility, string> = {
    PUBLIC: "Công khai",
    PRIVATE: "Riêng tư",
    FACULTY: "Theo khoa",
};

const VISIBILITY_COLOR: Record<TopicVisibility, string> = {
    PUBLIC: "bg-green-100 text-green-800 border-green-200",
    PRIVATE: "bg-gray-100 text-gray-800 border-gray-200",
    FACULTY: "bg-blue-100 text-blue-800 border-blue-200",
};

export const columns: ColumnDef<TopicResponse>[] = [
    {
        accessorKey: "title",
        header: "Tiêu đề",
        cell: ({ row }) => (
            <span className="font-medium line-clamp-2">
        {row.original.title}
      </span>
        ),
    },
    {
        accessorKey: "categoryName",
        header: "Danh mục",
        cell: ({ row }) => (
            <span className="text-sm">{row.original.categoryName}</span>
        ),
    },
    {
        accessorKey: "topicVisibility",
        header: "Hiển thị",
        cell: ({ row }) => {
            const visibility = row.original.topicVisibility;
            return (
                <Badge
                    variant="outline"
                    className={`${VISIBILITY_COLOR[visibility]} hover:${VISIBILITY_COLOR[visibility]}`}
                >
                    {VISIBILITY_LABEL[visibility]}
                </Badge>
            );
        },
    },
    {
        accessorKey: "createdAt",
        header: "Ngày tạo",
        cell: ({ row }) =>
            row.original.createdAt ? (
                <span className="text-sm text-muted-foreground">
          {format(new Date(row.original.createdAt), "dd/MM/yyyy HH:mm")}
        </span>
            ) : (
                "-"
            ),
    },
    {
        accessorKey: "isDeleted",
        header: "Trạng thái",
        cell: ({ row }) => (
            row.original.isDeleted ? (
                <Badge variant="destructive">Đã xóa</Badge>
            ) : (
                <Badge variant="outline">Hoạt động</Badge>
            )
        ),
    },
    {
        id: "actions",
        header: "Hành động",
        cell: ({ row }) => <ActionCell topic={row.original} />,
    },
];

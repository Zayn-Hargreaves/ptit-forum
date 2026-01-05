import { ColumnDef } from "@tanstack/react-table";
import { Classroom, deleteClassroom } from "@/shared/api/classroom.service";
import { Button } from "@/shared/ui/button/button";
import { Badge } from "@/shared/ui/badge/badge";
import { useClassroomStore } from "../model/classroom-store";
import { Trash, Edit } from "lucide-react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

export const columns: ColumnDef<Classroom>[] = [
    {
        accessorKey: "className",
        header: "Tên lớp",
        cell: ({ row }) => (
            <div className="flex flex-col">
                <span className="font-medium">{row.original.className}</span>
                <span className="text-xs text-muted-foreground">{row.original.facultyName}</span>
            </div>
        ),
    },
    {
        accessorKey: "classCode",
        header: "Mã lớp",
        cell: ({ row }) => (
            <Badge variant="outline" className="font-mono">
                {row.original.classCode}
            </Badge>
        ),
    },
    {
        accessorKey: "schoolYearCode",
        header: "Khóa",
        cell: ({ row }) => (
            <Badge variant="secondary">
                {row.original.schoolYearCode}
            </Badge>
        ),
    },
    {
        header: "Niên khóa",
        cell: ({ row }) => (
            <span className="text-sm">
                {row.original.startedYear} - {row.original.endedYear}
            </span>
        ),
    },
    {
        id: "actions",
        header: "Hành động",
        cell: ({ row }) => {
            const classroom = row.original;
            const { openEdit } = useClassroomStore();
            const queryClient = useQueryClient();

            const handleDelete = async () => {
                const confirmed = confirm(
                    `Bạn có chắc muốn xóa lớp "${classroom.className}"?`
                );
                if (!confirmed) return;

                try {
                    await deleteClassroom(classroom.id);
                    toast.success("Đã xóa lớp học");
                    queryClient.invalidateQueries({
                        queryKey: ["admin-classrooms"],
                    });
                } catch (error) {
                    console.error(error);
                    toast.error("Xóa lớp thất bại");
                }
            };

            return (
                <div className="flex items-center gap-2">
                    <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => openEdit(classroom)}
                        title="Chỉnh sửa"
                    >
                        <Edit className="h-4 w-4" />
                    </Button>

                    <Button
                        size="icon"
                        variant="ghost"
                        onClick={handleDelete}
                        title="Xóa"
                    >
                        <Trash className="h-4 w-4 text-red-500" />
                    </Button>
                </div>
            );
        },
    },
];
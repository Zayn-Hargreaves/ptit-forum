import { ColumnDef } from "@tanstack/react-table";
import { Faculty } from "@/shared/api/faculty.service";
import { Button } from "@/shared/ui/button/button";
import { Badge } from "@/shared/ui/badge/badge";
import { useFacultyStore } from "../model/faculty-store";
import { Trash, Edit } from "lucide-react";
import { deleteFaculty } from "@/shared/api/faculty.service";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

export const columns: ColumnDef<Faculty>[] = [
    {
        accessorKey: "facultyName",
        header: "Tên khoa",
        cell: ({ row }) => (
            <div className="flex flex-col max-w-[250px]">
                <span
                    className="font-medium truncate"
                    title={row.original.facultyName}
                >
                    {row.original.facultyName}
                </span>
                {row.original.facultyCode && (
                    <span className="text-xs text-muted-foreground">
                        {row.original.facultyCode}
                    </span>
                )}
            </div>
        ),
    },
    {
        accessorKey: "facultyCode",
        header: "Mã khoa",
        cell: ({ row }) => (
            <Badge variant="secondary" className="font-mono">
                {row.original.facultyCode}
            </Badge>
        ),
    },
    {
        accessorKey: "description",
        header: "Mô tả",
        cell: ({ row }) => (
            <span
                className="text-sm text-muted-foreground truncate block max-w-[300px]"
                title={row.original.description}
            >
                {row.original.description || "—"}
            </span>
        ),
    },
    {
        id: "actions",
        header: "Hành động",
        cell: ({ row }) => {
            const faculty = row.original;
            const { openEdit } = useFacultyStore();
            const queryClient = useQueryClient();

            const handleDelete = async () => {
                const confirmed = confirm(
                    `Bạn có chắc muốn xóa khoa "${faculty.facultyName}"?`
                );
                if (!confirmed) return;

                try {
                    await deleteFaculty(faculty.id);
                    toast.success("Đã xóa khoa");
                    queryClient.invalidateQueries({
                        queryKey: ["admin-faculties"],
                    });
                } catch (error) {
                    console.error(error);
                    toast.error("Xóa khoa thất bại");
                }
            };

            return (
                <div className="flex items-center gap-2">
                    <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => openEdit(faculty)}
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

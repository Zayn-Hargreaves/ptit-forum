import { useState } from "react";
import { MoreHorizontal, Edit, Trash, Send } from "lucide-react";
import { Button, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@shared/ui";
import { useAnnouncementStore } from "../model/announcement-store";
import { announcementApi } from "@shared/api/announcement.service";
import {AnnouncementResponse} from "@entities/announcement/model/types";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

interface ActionCellProps {
    announcementResponse: AnnouncementResponse;
}

export const ActionCell = ({ announcementResponse }: ActionCellProps) => {
    const { openEdit, openRelease } = useAnnouncementStore();
    const queryClient = useQueryClient();
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        if (!confirm(`Bạn có chắc muốn xóa thông báo "${announcementResponse.title}"?`)) return;

        try {
            setIsDeleting(true);
            await announcementApi.delete(announcementResponse.id);
            toast.success("Đã xóa thông báo");
            queryClient.invalidateQueries({ queryKey: ["admin-announcements"] });
        } catch (error) {
            toast.error("Xóa thất bại");
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Mở menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>Thao tác</DropdownMenuLabel>

                {/* Chỉ cho phép Sửa nếu chưa phát hành (tùy nghiệp vụ, ở đây giả sử cho sửa hết) */}
                <DropdownMenuItem onClick={() => openEdit(announcementResponse)}>
                    <Edit className="mr-2 h-4 w-4" /> Chỉnh sửa
                </DropdownMenuItem>

                {!announcementResponse.announcementStatus && (
                    <DropdownMenuItem onClick={() => openRelease(announcementResponse)}>
                        <Send className="mr-2 h-4 w-4 text-blue-600" /> Phát hành
                    </DropdownMenuItem>
                )}

                <DropdownMenuItem onClick={handleDelete} className="text-red-600 focus:text-red-600">
                    <Trash className="mr-2 h-4 w-4" />
                    {isDeleting ? "Đang xóa..." : "Xóa"}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
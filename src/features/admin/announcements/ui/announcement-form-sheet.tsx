"use client";

import {useEffect, useState} from "react";
import {Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle} from "@/shared/ui/sheet/sheet";
import {
    Button,
    Input,
    Label,
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    Textarea
} from "@shared/ui";
import {toast} from "sonner";
import {useAnnouncementStore} from "../model/announcement-store";
import {announcementApi} from "@shared/api/announcement.service";
import {AnnouncementType} from "@entities/announcement/model/types";
import {useQueryClient} from "@tanstack/react-query";
import {Loader2, Save} from "lucide-react";

export function AnnouncementFormSheet() {
    const { selectedAnnouncement, isOpenConfig, close } = useAnnouncementStore();
    const queryClient = useQueryClient();

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [type, setType] = useState<AnnouncementType>(AnnouncementType.ACADEMIC);
    const [isProcessing, setIsProcessing] = useState(false);

    const isEdit = !!selectedAnnouncement;

    // Sync form data
    useEffect(() => {
        if (selectedAnnouncement && isOpenConfig) {
            setTitle(selectedAnnouncement.title);
            setContent(selectedAnnouncement.content);
            setType(selectedAnnouncement.announcementType);
        } else {
            setTitle("");
            setContent("");
            setType(AnnouncementType.ACADEMIC);
        }
    }, [selectedAnnouncement, isOpenConfig]);

    const handleSubmit = async () => {
        if (!title.trim() || !content.trim()) {
            toast.error("Vui lòng điền đủ tiêu đề và nội dung");
            return;
        }

        try {
            setIsProcessing(true);
            if (isEdit && selectedAnnouncement) {
                // Update
                await announcementApi.update(selectedAnnouncement.id, {
                    title,
                    content,
                    announcementType: type,
                    announcementStatus: selectedAnnouncement.announcementStatus, // Giữ nguyên trạng thái
                    facultyIds: [], // Backend yêu cầu list nhưng logic update có thể chưa cần đổi phạm vi
                    classCodes: [],
                    schoolYearCodes: []
                });
                toast.success("Cập nhật thành công");
            } else {
                // Create
                await announcementApi.create({
                    title,
                    content,
                    announcementType: type,
                    fileMetadataIds: [] // TODO: Tích hợp module upload file
                });
                toast.success("Tạo thông báo thành công");
            }

            queryClient.invalidateQueries({ queryKey: ["admin-announcements"] });
            close();
        } catch (error) {
            console.error(error);
            toast.error("Thao tác thất bại");
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <Sheet open={isOpenConfig} onOpenChange={(open) => !open && close()}>
            <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
                <SheetHeader>
                    <SheetTitle>{isEdit ? "Cập nhật thông báo" : "Tạo thông báo mới"}</SheetTitle>
                    <SheetDescription>
                        Nhập thông tin chi tiết cho thông báo. Sau khi tạo, bạn cần "Phát hành" để sinh viên có thể nhìn thấy.
                    </SheetDescription>
                </SheetHeader>

                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label>Tiêu đề</Label>
                        <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Nhập tiêu đề..." />
                    </div>

                    <div className="space-y-2">
                        <Label>Loại tin</Label>
                        <Select value={type} onValueChange={(val) => setType(val as AnnouncementType)}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ACADEMIC">Học tập</SelectItem>
                                <SelectItem value="ACTIVITY">Hoạt động</SelectItem>
                                <SelectItem value="TUITION">Học phí</SelectItem>
                                <SelectItem value="OTHER">Khác</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label>Nội dung</Label>
                        <Textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            rows={10}
                            placeholder="Nhập nội dung thông báo..."
                        />
                    </div>

                    {/* Placeholder cho Upload File */}
                    <div className="rounded border border-dashed p-4 text-center text-sm text-muted-foreground">
                        Khu vực tải file đính kèm (Đang phát triển)
                    </div>
                </div>

                <SheetFooter>
                    <Button variant="ghost" onClick={close} disabled={isProcessing}>Hủy</Button>
                    <Button onClick={handleSubmit} disabled={isProcessing}>
                        {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        <Save className="mr-2 h-4 w-4" />
                        {isEdit ? "Lưu thay đổi" : "Lưu thông báo"}
                    </Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}
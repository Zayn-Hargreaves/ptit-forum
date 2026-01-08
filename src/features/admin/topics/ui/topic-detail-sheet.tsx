// features/admin/topics/ui/topic-detail-sheet.tsx
"use client";

import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/shared/ui/sheet/sheet";
import { Badge, Separator, Button, Avatar, AvatarFallback, AvatarImage } from "@shared/ui";
import { format } from "date-fns";
import { useTopicStore } from "../model/topic-store";
import { Calendar, User, MessageSquare, Eye, Folder, ExternalLink } from "lucide-react";
import Link from "next/link"; // Nếu muốn link ra trang bài viết gốc

// Map hiển thị Visibility (dùng lại hoặc import từ constants)
const VISIBILITY_LABEL: Record<string, string> = {
    PUBLIC: "Công khai",
    PRIVATE: "Riêng tư",
    FACULTY: "Theo khoa",
};

export function TopicDetailSheet() {
    const { selectedTopic, isOpenDetail, close } = useTopicStore();

    if (!selectedTopic) return null;

    return (
        <Sheet open={isOpenDetail} onOpenChange={(open) => !open && close()}>
            <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
                <SheetHeader className="mb-6">
                    <div className="flex items-start justify-between gap-4">
                        <SheetTitle className="text-xl font-bold leading-normal">
                            {selectedTopic.title}
                        </SheetTitle>
                        <Badge variant={selectedTopic.isDeleted ? "destructive" : "outline"}>
                            {selectedTopic.isDeleted ? "Đã xóa" : "Hoạt động"}
                        </Badge>
                    </div>

                    {/* Metadata Header */}
                    <div className="flex flex-wrap gap-3 text-sm text-muted-foreground mt-2">
                        <div className="flex items-center gap-1">
                            <Folder className="h-4 w-4" />
                            <span>{selectedTopic.categoryName}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>{selectedTopic.createdAt ? format(new Date(selectedTopic.createdAt), "dd/MM/yyyy HH:mm") : "-"}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Badge variant="secondary" className="text-xs">
                                {VISIBILITY_LABEL[selectedTopic.topicVisibility] || selectedTopic.topicVisibility}
                            </Badge>
                        </div>
                    </div>
                </SheetHeader>

                <div className="space-y-6">
                    {/* Author Info */}
                    <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
                        <Avatar className="h-10 w-10">
                            {/* Nếu có avatarUrl trong topic response */}
                            {/* <AvatarImage src={selectedTopic.authorAvatar} /> */}
                            <AvatarFallback><User className="h-5 w-5" /></AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="text-sm font-medium text-foreground">
                                {/* Giả sử response có field createdBy hoặc authorName */}
                                {selectedTopic.createdBy || "Người dùng ẩn danh"}
                            </p>
                            <p className="text-xs text-muted-foreground">Tác giả</p>
                        </div>
                    </div>

                    <Separator />

                    {/* Content Body */}
                    <div className="space-y-2">
                        <h4 className="font-semibold text-sm text-foreground">Nội dung bài viết</h4>
                        <div className="min-h-[150px] text-sm leading-relaxed whitespace-pre-wrap rounded-md border p-4 bg-background">
                            {/* Nếu content là HTML thì dùng dangerouslySetInnerHTML, nếu plain text thì để trần */}
                            {selectedTopic.content || "(Không có nội dung)"}
                        </div>
                    </div>

                    {/* Statistics (Nếu API có trả về) */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col items-center justify-center p-4 rounded-lg border bg-card">
                            <Eye className="h-5 w-5 mb-2 text-blue-500" />
                            <span className="text-lg font-bold">120</span> {/* Thay bằng field viewCount thực tế */}
                            <span className="text-xs text-muted-foreground">Lượt xem</span>
                        </div>
                        <div className="flex flex-col items-center justify-center p-4 rounded-lg border bg-card">
                            <MessageSquare className="h-5 w-5 mb-2 text-green-500" />
                            <span className="text-lg font-bold">15</span> {/* Thay bằng field commentCount thực tế */}
                            <span className="text-xs text-muted-foreground">Bình luận</span>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-2 pt-4">
                        <Button variant="outline" onClick={close}>Đóng</Button>
                        <Button variant="default" asChild>
                            <Link href={`/forum/topics/${selectedTopic.id}`} target="_blank">
                                <ExternalLink className="mr-2 h-4 w-4" />
                                Xem trên Diễn đàn
                            </Link>
                        </Button>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}
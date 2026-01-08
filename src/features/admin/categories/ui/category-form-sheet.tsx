// features/admin/categories/ui/category-form-sheet.tsx

"use client";

import { useEffect, useState } from "react";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/shared/ui/sheet/sheet";
import {
    Button, Input, Label, Textarea,
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue // Import thêm Select
} from "@shared/ui";
import { toast } from "sonner";
import { useCategoryStore } from "../model/category-store";
import { categoryApi } from "@shared/api/category.service";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2, Save } from "lucide-react";
// Import Enum và Type
import { CategoryType } from "@entities/category/model/types";

export function CategoryFormSheet() {
    const { selectedCategory, isOpenConfig, close } = useCategoryStore();
    const queryClient = useQueryClient();

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");

    // Khởi tạo giá trị mặc định là ACADEMIC (hoặc loại nào bạn muốn)
    const [type, setType] = useState<CategoryType>(CategoryType.ACADEMIC);

    const [isProcessing, setIsProcessing] = useState(false);

    const isEdit = !!selectedCategory;

    // Sync form data khi mở Edit
    useEffect(() => {
        if (selectedCategory && isOpenConfig) {
            setName(selectedCategory.name);
            setDescription(selectedCategory.description);
            setType(selectedCategory.categoryType); // Gán enum từ API vào state
        } else {
            // Reset form khi tạo mới
            setName("");
            setDescription("");
            setType(CategoryType.ACADEMIC);
        }
    }, [selectedCategory, isOpenConfig]);

    const handleSubmit = async () => {
        if (!name.trim()) {
            toast.error("Vui lòng nhập tên danh mục");
            return;
        }

        try {
            setIsProcessing(true);
            const payload = {
                name,
                description,
                categoryType: type // Gửi enum lên
            };

            if (isEdit && selectedCategory) {
                await categoryApi.update(selectedCategory.id, payload);
                toast.success("Cập nhật thành công");
            } else {
                await categoryApi.create(payload);
                toast.success("Tạo danh mục thành công");
            }

            queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
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
            <SheetContent className="w-full sm:max-w-lg">
                <SheetHeader>
                    <SheetTitle>{isEdit ? "Cập nhật danh mục" : "Tạo danh mục mới"}</SheetTitle>
                    <SheetDescription>
                        Quản lý các danh mục bài viết hoặc thông báo trên hệ thống.
                    </SheetDescription>
                </SheetHeader>

                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label>Tên danh mục <span className="text-red-500">*</span></Label>
                        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="VD: Góc học tập" />
                    </div>

                    <div className="space-y-2">
                        <Label>Loại danh mục</Label>
                        {/* Thay Input bằng Select */}
                        <Select value={type} onValueChange={(val) => setType(val as CategoryType)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Chọn loại" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value={CategoryType.ACADEMIC}>Học tập</SelectItem>
                                <SelectItem value={CategoryType.CLASSROOM}>Lớp học</SelectItem>
                                <SelectItem value={CategoryType.CLUB}>Câu lạc bộ</SelectItem>
                                <SelectItem value={CategoryType.LIFE}>Đời sống</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label>Mô tả</Label>
                        <Textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={4}
                            placeholder="Mô tả ngắn về danh mục này..."
                        />
                    </div>
                </div>

                <SheetFooter>
                    <Button variant="ghost" onClick={close} disabled={isProcessing}>Hủy</Button>
                    <Button onClick={handleSubmit} disabled={isProcessing}>
                        {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        <Save className="mr-2 h-4 w-4" />
                        {isEdit ? "Lưu thay đổi" : "Tạo mới"}
                    </Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}
// features/admin/semesters/ui/semester-form-sheet.tsx
"use client";

import { useState } from "react";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/shared/ui/sheet/sheet";
import { Button, Input, Label, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@shared/ui";
import { toast } from "sonner";
import { useSemesterStore } from "../model/semester-store";
import { semesterApi } from "@shared/api/semester.service";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2, Save } from "lucide-react";

export function SemesterFormSheet() {
    const { isOpenCreate, close } = useSemesterStore();
    const queryClient = useQueryClient();

    // Form State
    const [id, setId] = useState<string>(""); // Dùng string để dễ handle input, parse int khi submit
    const [semesterType, setSemesterType] = useState("1");
    const [schoolYear, setSchoolYear] = useState<string>(new Date().getFullYear().toString());
    const [isProcessing, setIsProcessing] = useState(false);

    const handleSubmit = async () => {
        if (!id || !schoolYear || !semesterType) {
            toast.error("Vui lòng điền đầy đủ thông tin");
            return;
        }

        try {
            setIsProcessing(true);

            await semesterApi.create({
                id: parseInt(id),
                semesterType,
                schoolYear: parseInt(schoolYear)
            });

            toast.success("Tạo học kỳ thành công");
            queryClient.invalidateQueries({ queryKey: ["admin-semesters"] });

            // Reset form
            setId("");
            close();
        } catch (error) {
            console.error(error);
            toast.error("Tạo thất bại. Có thể ID đã tồn tại.");
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <Sheet open={isOpenCreate} onOpenChange={(open) => !open && close()}>
            <SheetContent className="w-full sm:max-w-lg">
                <SheetHeader>
                    <SheetTitle>Tạo học kỳ mới</SheetTitle>
                    <SheetDescription>
                        Thêm học kỳ mới vào hệ thống.
                    </SheetDescription>
                </SheetHeader>

                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label>Mã học kỳ (ID) <span className="text-red-500">*</span></Label>
                        <Input
                            type="number"
                            value={id}
                            onChange={(e) => setId(e.target.value)}
                            placeholder="VD: 20231"
                        />
                        <p className="text-xs text-muted-foreground">Nhập mã số định danh cho học kỳ (VD: 20231).</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Học kỳ</Label>
                            <Select value={semesterType} onValueChange={setSemesterType}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="1">Học kỳ 1</SelectItem>
                                    <SelectItem value="2">Học kỳ 2</SelectItem>
                                    <SelectItem value="3">Học kỳ 3 (Hè)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>Năm học</Label>
                            <Input
                                type="number"
                                value={schoolYear}
                                onChange={(e) => setSchoolYear(e.target.value)}
                                placeholder="VD: 2023"
                            />
                        </div>
                    </div>
                </div>

                <SheetFooter>
                    <Button variant="ghost" onClick={close} disabled={isProcessing}>Hủy</Button>
                    <Button onClick={handleSubmit} disabled={isProcessing}>
                        {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        <Save className="mr-2 h-4 w-4" />
                        Lưu học kỳ
                    </Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}
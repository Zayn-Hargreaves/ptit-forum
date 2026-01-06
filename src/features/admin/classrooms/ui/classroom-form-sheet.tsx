'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Loader2, Save, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { CohortCode, createClassroom, updateClassroom } from '@/shared/api/classroom.service';
import { getAllFaculties } from '@/shared/api/faculty.service'; // Cần import service lấy danh sách khoa
import { Button } from '@/shared/ui/button/button';
import { Input } from '@/shared/ui/input/input';
import { Label } from '@/shared/ui/label/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select/select'; // Giả định bạn có component Select
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/shared/ui/sheet/sheet';

import { useClassroomStore } from '../model/classroom-store';

type ClassroomFormState = {
  className: string;
  classCode: string;
  facultyId: string; // Chỉ dùng khi tạo mới
  startedYear: string; // Dùng string cho input, convert sang number khi submit
  endedYear: string;
  schoolYearCode: CohortCode;
};

export function ClassroomFormSheet() {
  const { selectedClassroom, isOpen, close } = useClassroomStore();
  const queryClient = useQueryClient();
  const [isProcessing, setIsProcessing] = useState(false);

  // Fetch danh sách khoa để chọn khi tạo mới
  const { data: facultiesData } = useQuery({
    queryKey: ['all-faculties-options'],
    queryFn: () => getAllFaculties({ page: 0, size: 100 }), // Lấy nhiều để hiển thị
    enabled: isOpen && !selectedClassroom, // Chỉ fetch khi mở form tạo mới
  });

  const faculties = facultiesData?.data || [];

  const [form, setForm] = useState<ClassroomFormState>({
    className: '',
    classCode: '',
    facultyId: '',
    startedYear: new Date().getFullYear().toString(),
    endedYear: (new Date().getFullYear() + 4).toString(),
    schoolYearCode: CohortCode.D21,
  });

  const isEdit = !!selectedClassroom;

  useEffect(() => {
    if (selectedClassroom) {
      setForm({
        className: selectedClassroom.className,
        classCode: selectedClassroom.classCode,
        facultyId: '', // Update API không cần/không cho sửa faculty
        startedYear: selectedClassroom.startedYear.toString(),
        endedYear: selectedClassroom.endedYear.toString(),
        schoolYearCode: selectedClassroom.schoolYearCode,
      });
    } else {
      // Reset form
      setForm({
        className: '',
        classCode: '',
        facultyId: '',
        startedYear: new Date().getFullYear().toString(),
        endedYear: (new Date().getFullYear() + 4).toString(),
        schoolYearCode: CohortCode.D21,
      });
    }
  }, [selectedClassroom, isOpen]);

  const handleSubmit = async () => {
    // Validation cơ bản
    if (!form.className || !form.startedYear || !form.endedYear) {
      toast.error('Vui lòng điền đầy đủ thông tin');
      return;
    }

    if (!isEdit && (!form.classCode || !form.facultyId)) {
      toast.error('Mã lớp và Khoa là bắt buộc khi tạo mới');
      return;
    }

    try {
      setIsProcessing(true);
      const payloadCommon = {
        className: form.className,
        startedYear: parseInt(form.startedYear),
        endedYear: parseInt(form.endedYear),
        schoolYearCode: form.schoolYearCode,
      };

      if (isEdit && selectedClassroom) {
        // API Update: Không gửi classCode, không gửi facultyId
        await updateClassroom(selectedClassroom.id, payloadCommon);
        toast.success('Cập nhật lớp thành công');
      } else {
        // API Create: Cần facultyId trên URL và classCode trong body
        await createClassroom(form.facultyId, {
          ...payloadCommon,
          classCode: form.classCode,
        });
        toast.success('Tạo lớp mới thành công');
      }

      queryClient.invalidateQueries({ queryKey: ['admin-classrooms'] });
      close();
    } catch (error) {
      console.error(error);
      toast.error('Thao tác thất bại');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && close()}>
      <SheetContent className="flex h-full flex-col overflow-y-auto p-4 sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>{isEdit ? 'Cập nhật lớp học' : 'Tạo lớp học mới'}</SheetTitle>
          <SheetDescription>
            {isEdit ? 'Chỉnh sửa thông tin lớp học' : 'Thêm lớp học vào một khoa cụ thể'}
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 space-y-4 py-4">
          {/* Chọn Khoa - Chỉ hiện khi tạo mới */}
          {!isEdit && (
            <div className="space-y-2">
              <Label>Khoa trực thuộc</Label>
              <Select
                value={form.facultyId}
                onValueChange={(val) => setForm({ ...form, facultyId: val })}
                disabled={isProcessing}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn khoa" />
                </SelectTrigger>
                <SelectContent>
                  {faculties.map((f) => (
                    <SelectItem key={f.id} value={f.id}>
                      {f.facultyName} ({f.facultyCode})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <Label>Mã lớp</Label>
            <Input
              placeholder="VD: D21CQCN01-B"
              value={form.classCode}
              onChange={(e) => setForm({ ...form, classCode: e.target.value })}
              disabled={isEdit || isProcessing} // API Update không cho sửa classCode
            />
            {isEdit && (
              <span className="text-muted-foreground text-xs">Mã lớp không thể thay đổi</span>
            )}
          </div>

          <div className="space-y-2">
            <Label>Tên lớp</Label>
            <Input
              placeholder="VD: Công nghệ thông tin 01"
              value={form.className}
              onChange={(e) => setForm({ ...form, className: e.target.value })}
              disabled={isProcessing}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Khóa (Cohort)</Label>
              <Select
                value={form.schoolYearCode}
                onValueChange={(val) => setForm({ ...form, schoolYearCode: val as CohortCode })}
                disabled={isProcessing}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(CohortCode).map((code) => (
                    <SelectItem key={code} value={code}>
                      {code}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Năm bắt đầu</Label>
              <Input
                type="number"
                value={form.startedYear}
                onChange={(e) => setForm({ ...form, startedYear: e.target.value })}
                disabled={isProcessing}
              />
            </div>
            <div className="space-y-2">
              <Label>Năm kết thúc</Label>
              <Input
                type="number"
                value={form.endedYear}
                onChange={(e) => setForm({ ...form, endedYear: e.target.value })}
                disabled={isProcessing}
              />
            </div>
          </div>
        </div>

        <SheetFooter>
          <Button variant="ghost" onClick={close} disabled={isProcessing}>
            <X className="mr-2 h-4 w-4" /> Hủy
          </Button>
          <Button onClick={handleSubmit} disabled={isProcessing}>
            {isProcessing ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            {isEdit ? 'Lưu thay đổi' : 'Tạo lớp'}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

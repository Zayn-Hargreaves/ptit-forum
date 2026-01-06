'use client';

import { useQueryClient } from '@tanstack/react-query';
import { Loader2, Save, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { createFaculty, updateFaculty } from '@/shared/api/faculty.service';
import { Button } from '@/shared/ui/button/button';
import { Input } from '@/shared/ui/input/input';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/shared/ui/sheet/sheet';
import { Textarea } from '@/shared/ui/textarea/textarea';

import { useFacultyStore } from '../model/faculty-store';

/* ---------------- Types ---------------- */
type FacultyForm = {
  facultyName: string;
  facultyCode: string;
  description: string;
};

/* ---------------- Component ---------------- */
export function FacultyFormSheet() {
  const { selectedFaculty, isOpen, close } = useFacultyStore();
  const queryClient = useQueryClient();

  const [form, setForm] = useState<FacultyForm>({
    facultyName: '',
    facultyCode: '',
    description: '',
  });

  const [isProcessing, setIsProcessing] = useState(false);

  const isEdit = !!selectedFaculty;

  /* ---------------- Sync form ---------------- */
  useEffect(() => {
    if (selectedFaculty) {
      setForm({
        facultyName: selectedFaculty.facultyName ?? '',
        facultyCode: selectedFaculty.facultyCode ?? '',
        description: selectedFaculty.description ?? '',
      });
    } else {
      setForm({
        facultyName: '',
        facultyCode: '',
        description: '',
      });
    }
  }, [selectedFaculty]);

  /* ---------------- Reset when close ---------------- */
  useEffect(() => {
    if (!isOpen) {
      setIsProcessing(false);
    }
  }, [isOpen]);

  /* ---------------- Submit ---------------- */
  const handleSubmit = async () => {
    if (!form.facultyName.trim() || !form.facultyCode.trim()) {
      toast.error('Tên khoa và mã khoa là bắt buộc');
      return;
    }

    try {
      setIsProcessing(true);

      if (isEdit && selectedFaculty) {
        await updateFaculty(selectedFaculty.id, form);
        toast.success('Cập nhật khoa thành công');
      } else {
        await createFaculty(form);
        toast.success('Tạo khoa mới thành công');
      }

      queryClient.invalidateQueries({ queryKey: ['admin-faculties'] });
      close();
    } catch (error) {
      toast.error('Thao tác thất bại');
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && close()}>
      <SheetContent className="flex h-full flex-col sm:max-w-lg">
        <SheetHeader className="mb-4">
          <SheetTitle className="text-xl font-bold">
            {isEdit ? 'Cập nhật khoa' : 'Tạo khoa mới'}
          </SheetTitle>
          <SheetDescription>
            {isEdit ? 'Chỉnh sửa thông tin khoa trong hệ thống' : 'Thêm mới một khoa vào hệ thống'}
          </SheetDescription>
        </SheetHeader>

        {/* Form */}
        <div className="flex-1 space-y-4 py-2">
          <Input
            placeholder="Tên khoa"
            value={form.facultyName}
            onChange={(e) => setForm({ ...form, facultyName: e.target.value })}
            disabled={isProcessing}
          />

          <Input
            placeholder="Mã khoa"
            value={form.facultyCode}
            onChange={(e) => setForm({ ...form, facultyCode: e.target.value })}
            disabled={isProcessing}
          />

          <Textarea
            placeholder="Mô tả khoa (không bắt buộc)"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={4}
            disabled={isProcessing}
          />
        </div>

        {/* Footer */}
        <SheetFooter className="flex justify-end gap-2 border-t pt-4">
          <Button variant="ghost" onClick={close} disabled={isProcessing}>
            <X className="mr-2 h-4 w-4" />
            Hủy
          </Button>

          <Button onClick={handleSubmit} disabled={isProcessing}>
            {isProcessing ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            {isEdit ? 'Lưu thay đổi' : 'Tạo khoa'}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

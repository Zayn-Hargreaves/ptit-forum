"use client";

import type React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@shared/providers/auth-provider";
import { User } from "@shared/types/auth";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@shared/ui/dialog/dialog";
import { Label } from "@shared/ui/label/label";
import { Input } from "@shared/ui/input/input";
import { Button } from "@shared/ui/button/button";

interface ProfileCompletionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ProfileCompletionModal({
  isOpen,
  onClose,
}: ProfileCompletionModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    studentId: "",
    faculty: "",
    class: "",
  });

  const { user } = useAuth();

  const queryClient = useQueryClient();
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const promise = new Promise(async (resolve, reject) => {
      try {
        // --- TODO: GỌI API UPDATE PROFILE TẠI ĐÂY ---
        // const updatedUser = await userApi.updateProfile(formData);

        // Simulate delay API
        await new Promise((res) => setTimeout(res, 1000));

        // --- 🧠 SENIOR FIX: UPDATE CACHE ---
        // Thay vì setUser (không tồn tại), ta update trực tiếp vào key ["me"]
        // React Query sẽ tự động bắn signal để re-render toàn bộ App với data mới.
        queryClient.setQueryData<User | null>(["me"], (oldData) => {
          if (!oldData) return null;
          return {
            ...oldData,
            ...formData,
            // status: "complete", // Nếu Backend có trả về status mới thì update
          };
        });

        // Nếu muốn chắc ăn 100% data đồng bộ server thì dùng dòng dưới (nhưng sẽ tốn 1 request):
        // await queryClient.invalidateQueries({ queryKey: ["me"] });

        resolve(true);
        onClose();
        router.push("/forum");
      } catch (error) {
        reject(error);
      }
    });

    // UX: Dùng toast.promise để hiển thị Loading -> Success/Error tự động
    toast.promise(promise, {
      loading: "Đang cập nhật hồ sơ...",
      success: "Hồ sơ của bạn đã được cập nhật thành công!",
      error: "Không thể cập nhật hồ sơ. Vui lòng thử lại.",
    });

    setIsLoading(false);
  };

  const handleSkip = () => {
    onClose();
    toast.info("Bạn có thể cập nhật hồ sơ sau trong phần Cài đặt.");
    router.push("/forum");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Hoàn thiện hồ sơ cá nhân</DialogTitle>
          <DialogDescription>
            Vui lòng cung cấp thông tin cá nhân để hoàn thiện hồ sơ của bạn.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Họ và tên</Label>
            <Input
              id="name"
              name="name"
              placeholder="Nguyễn Văn A"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="studentId">Mã số sinh viên</Label>
            <Input
              id="studentId"
              name="studentId"
              placeholder="B21DCCN001"
              value={formData.studentId}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="faculty">Khoa/Bộ môn</Label>
            <Input
              id="faculty"
              name="faculty"
              placeholder="Công nghệ thông tin"
              value={formData.faculty}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="class">Lớp</Label>
            <Input
              id="class"
              name="class"
              placeholder="D21CQCN01-B"
              value={formData.class}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1" disabled={isLoading}>
              Hoàn thiện
            </Button>
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={handleSkip}
              disabled={isLoading}
            >
              Bỏ qua
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

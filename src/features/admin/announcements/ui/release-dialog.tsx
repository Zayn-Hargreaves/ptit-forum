import { announcementApi } from '@shared/api/announcement.service';
import { CohortCode } from '@shared/api/classroom.service';
import { getAllFaculties } from '@shared/api/faculty.service';
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@shared/ui';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Loader2, Send } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import { useAnnouncementStore } from '../model/announcement-store';

export function ReleaseDialog() {
  const { isOpenRelease, selectedAnnouncement, close } = useAnnouncementStore();
  const queryClient = useQueryClient();
  const [isProcessing, setIsProcessing] = useState(false);

  // Form states (Giản lược: Chọn 1 Khoa, 1 Hệ cho demo. Thực tế dùng MultiSelect nếu có UI)
  const [selectedFacultyId, setSelectedFacultyId] = useState<string>('ALL');
  const [selectedCohort, setSelectedCohort] = useState<CohortCode | 'ALL'>('ALL');

  // Fetch Faculties
  const { data: facultiesRes } = useQuery({
    queryKey: ['all-faculties-options'],
    queryFn: () => getAllFaculties({ page: 0, size: 100 }),
    enabled: isOpenRelease,
  });
  const faculties = facultiesRes?.data || [];

  const handleRelease = async () => {
    if (!selectedAnnouncement) return;

    try {
      setIsProcessing(true);

      // Map lựa chọn "ALL" thành list rỗng (Backend hiểu là gửi hết?) hoặc logic tùy biến
      // Ở đây giả định backend cần list ID cụ thể hoặc rỗng
      const facultyIds = selectedFacultyId !== 'ALL' ? [selectedFacultyId] : [];
      const schoolYearCodes = selectedCohort !== 'ALL' ? [selectedCohort] : [];

      await announcementApi.release(selectedAnnouncement.id, {
        facultyIds,
        classCodes: [], // Chưa làm UI chọn lớp chi tiết
        schoolYearCodes,
      });

      toast.success('Phát hành thông báo thành công');
      queryClient.invalidateQueries({ queryKey: ['admin-announcements'] });
      close();
    } catch (error) {
      console.error(error);
      toast.error('Phát hành thất bại');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={isOpenRelease} onOpenChange={(open) => !open && close()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Phát hành thông báo</DialogTitle>
          <DialogDescription>
            Chọn đối tượng nhận thông báo. Nếu để trống, thông báo sẽ gửi công khai.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label>Khoa (Phạm vi)</Label>
            <Select value={selectedFacultyId} onValueChange={setSelectedFacultyId}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn khoa" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Tất cả các khoa</SelectItem>
                {faculties.map((f) => (
                  <SelectItem key={f.id} value={f.id}>
                    {f.facultyName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label>Hệ đào tạo</Label>
            <Select
              value={selectedCohort}
              onValueChange={(val) => setSelectedCohort(val as CohortCode | 'ALL')}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn hệ" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Tất cả hệ</SelectItem>
                <SelectItem value="D">Đại học</SelectItem>
                <SelectItem value="M">Cao học</SelectItem>
                <SelectItem value="P">Tiến sĩ</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={close} disabled={isProcessing}>
            Hủy
          </Button>
          <Button onClick={handleRelease} disabled={isProcessing}>
            {isProcessing ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Send className="mr-2 h-4 w-4" />
            )}
            Phát hành ngay
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

import { UpdateProfileForm } from '@features/profile/update-profile/ui/update-profile-form';
import { Separator } from '@shared/ui/separator/separator';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cài đặt hồ sơ | PTIT Forum',
  description: 'Cập nhật thông tin cá nhân và ảnh đại diện',
};

export default function ProfileSettingsPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6 p-4 md:p-0">
      <div>
        <h3 className="text-lg font-medium">Hồ sơ cá nhân</h3>
        <p className="text-muted-foreground text-sm">
          Đây là thông tin hiển thị công khai trên diễn đàn.
        </p>
      </div>
      <Separator />
      <UpdateProfileForm />
    </div>
  );
}

"use client";

import { useParams } from "next/navigation";
import { ProfileHeader } from "@features/profile/view-profile/ui/profile-header";
import { useMe } from "@entities/session/model/queries";
import { ProfileTabs } from "@widgets/user-profile/profile-tabs";

export default function ProfilePage() {
  const params = useParams();
  const { data: me } = useMe();

  // Logic:
  // 1. Nếu params.id === me.id -> Hiển thị profile của mình (có nút Edit).
  // 2. Nếu params.id !== me.id -> Gọi API lấy user khác (chưa có nút Edit).

  if (!me) return <div>Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <ProfileHeader user={me} isOwnProfile={true} />
      <ProfileTabs />
    </div>
  );
}

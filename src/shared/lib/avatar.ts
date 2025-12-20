export function getAvatarUrl(params: {
  avatar?: string | null;
  email?: string | null;
  name?: string | null;
  size?: number;
}) {
  const { avatar, email, name, size = 64 } = params;
  const avatarTrimmed = avatar?.trim();
  if (avatarTrimmed) return avatarTrimmed;

  const seed = name?.trim() || email?.trim() || "User";

  return `https://ui-avatars.com/api/?name=${encodeURIComponent(
    seed
  )}&size=${size}&color=fff`;
}

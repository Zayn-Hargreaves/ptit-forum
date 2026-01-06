/**
 * User display utilities for handling missing or incomplete user information
 */

/**
 * Get display name for a user with fallback for missing names
 * @param fullName - User's full name
 * @param fallback - Custom fallback text (default: "Người dùng ẩn danh")
 * @returns Display name
 */
export function getUserDisplayName(
  fullName?: string | null,
  fallback = 'Người dùng ẩn danh',
): string {
  if (!fullName || fullName.trim().length === 0) {
    return fallback;
  }
  return fullName.trim();
}

/**
 * Get initials for avatar fallback
 * @param fullName - User's full name
 * @param fallback - Fallback character (default: "?")
 * @returns 1-2 character initials
 */
export function getUserInitials(fullName?: string | null, fallback = '?'): string {
  const name = getUserDisplayName(fullName, '');
  if (!name) return fallback;

  const words = name.split(' ').filter(Boolean);
  if (words.length === 0) return fallback;

  // Take first letter of first and last word
  if (words.length === 1) {
    return words[0][0].toUpperCase();
  }

  return (words[0][0] + words[words.length - 1][0]).toUpperCase();
}

/**
 * Safely get avatar URL with empty string fallback
 * @param avatarUrl - User's avatar URL
 * @returns Avatar URL or empty string
 */
export function getAvatarUrl(avatarUrl?: string | null): string {
  return avatarUrl?.trim() || '';
}

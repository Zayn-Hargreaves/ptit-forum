import { BACKEND_ERROR_CODES } from '@shared/constants/error-codes';
import { ERROR_MESSAGES } from '@shared/constants/error-messages';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Validates and sanitizes a redirect URL to prevent open-redirect vulnerabilities.
 * Only allows relative paths that start with "/" but not "//" and do not contain schemes.
 * @param url - The URL to validate
 * @returns A safe redirect URL, defaulting to "/forum" if invalid
 */
export function validateRedirectUrl(url: string | null): string {
  const trimmedUrl = url?.trim();
  if (!trimmedUrl) {
    return '/forum';
  }

  // Reject URLs containing percent-encoded slashes or backslashes
  if (trimmedUrl.includes('%2F') || trimmedUrl.includes('%2f') || trimmedUrl.includes('\\')) {
    return '/forum';
  }

  try {
    const constructed = new URL(trimmedUrl, 'https://example.com');
    if (
      constructed.origin !== 'https://example.com' ||
      constructed.protocol !== 'https:' ||
      constructed.href.startsWith('//')
    ) {
      return '/forum';
    }
    // Return the sanitized relative path
    return constructed.pathname + constructed.search + constructed.hash;
  } catch {
    return '/forum';
  }
}

/**
 * Formats a date to a readable string format.
 * @param date - The date to format (string or Date object)
 * @returns Formatted date string in DD/MM/YYYY format
 */
export function formatDate(date: string | Date): string {
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) {
    return 'Invalid Date';
  }
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

export const getErrorMessage = (error: unknown) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const err = error as any;
  if (err?.message) return err.message;

  const backendCode = err?.response?.data?.code;
  const backendMessage = err?.response?.data?.message;

  if (backendCode === BACKEND_ERROR_CODES.TOKEN_EXPIRED) {
    return ERROR_MESSAGES[BACKEND_ERROR_CODES.TOKEN_EXPIRED];
  }

  if (backendMessage) {
    return backendMessage;
  }

  if (backendCode && ERROR_MESSAGES[backendCode]) {
    return ERROR_MESSAGES[backendCode];
  }

  return 'Đã có lỗi xảy ra. Vui lòng thử lại.';
};

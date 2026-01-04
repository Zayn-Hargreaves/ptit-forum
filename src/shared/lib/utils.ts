import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

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
    return "/forum";
  }

  // Reject URLs containing percent-encoded slashes or backslashes
  if (
    trimmedUrl.includes("%2F") ||
    trimmedUrl.includes("%2f") ||
    trimmedUrl.includes("\\")
  ) {
    return "/forum";
  }

  try {
    const constructed = new URL(trimmedUrl, "https://example.com");
    if (
      constructed.origin !== "https://example.com" ||
      constructed.protocol !== "https:" ||
      constructed.href.startsWith("//")
    ) {
      return "/forum";
    }
    // Return the sanitized relative path
    return constructed.pathname + constructed.search + constructed.hash;
  } catch {
    return "/forum";
  }
}

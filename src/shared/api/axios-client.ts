import axios, { AxiosError } from 'axios';
import { toast } from 'sonner';

// Determine base URL:
// - Server-side: Direct to Backend (using env var or default)
// - Client-side: Proxy through Next.js API Routes ('/api')
const getBaseUrl = (): string => {
  if (typeof window === 'undefined') {
    return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';
  }
  return '/api';
};

export const API_URL = getBaseUrl();

export const getPublicImageUrl = (path?: string | null) => {
  if (!path) return '/images/placeholder-document.jpg'; // Default placeholder
  if (path.startsWith('http')) return path; // Already full URL

  // Remove leading slash to avoid double slashes
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;

  // For images, we might still want to point directly to backend or through a specific image proxy.
  // Assuming the backend serves static files correctly.
  // If API_URL is /api (client), we need to know the real backend URL for images if we want to bypass proxy for static assets,
  // OR we proxy images too.
  // The original logic replaced '/api' from API_URL.

  // NOTE: If we are on client (API_URL = '/api'), replacing '/api' gives empty string.
  // So we should probably use the env var for images explicitly or proxy them.
  // Let's rely on the public env var for image construction to be safe and consistent.
  const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';
  const baseUrl = backendUrl.replace('/api', '');

  return `${baseUrl}/${cleanPath}`;
};

export const apiClient = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// INTERCEPTORS
// Note: We removed the request interceptor that attached 'Bearer token' from localStorage.
// The Next.js Proxy (BFF) will now handle attaching the token from valid HttpOnly cookies.

// Add Response Interceptor for global error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string; error?: string }>) => {
    const isClient = typeof window !== 'undefined';

    // Handle Network Errors
    if (!error.response) {
      if (isClient) {
        toast.error('Network error. Please check your connection.');
      } else {
        console.error('[Axios Server Error] Network error:', error.message);
      }
      return Promise.reject(error);
    }

    const { status, data } = error.response;
    const message = data?.message || data?.error || 'An error occurred';

    // Only show toasts on the client
    if (isClient) {
      switch (status) {
        case 401:
          // Unclear if we should redirect here instantly or let the AuthProvider handle the null user state.
          // Usually safe to notify user.
          // toast.error('Session expired. Please login again.');
          break;
        case 403:
          toast.error('You do not have permission to perform this action.');
          break;
        case 500:
          toast.error('Server error. Please try again later.');
          break;
        default:
          toast.error(message);
      }
    } else {
      // Suppress 401 Unauthorized logs on server-side to avoid noise for unauthenticated users
      if (status !== 401) {
        console.error(`[Axios Server Error] Status ${status}: ${message}`);
      }
    }

    return Promise.reject(error);
  }
);

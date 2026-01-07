import axios, { AxiosError } from 'axios';
import { toast } from 'sonner';

// Determine base URL:
// - Server-side: Direct to Backend (using env var or default)
// - Client-side: Proxy through Next.js API Routes ('/api')
const getBaseUrl = (): string => {
  if (typeof window === 'undefined') {
    // 🟢 SERVER SIDE
    if (process.env.INTERNAL_API_URL) {
      console.log('Server fetching data from:', process.env.INTERNAL_API_URL);
      return process.env.INTERNAL_API_URL;
    }
    return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';
  }

  // 🔵 CLIENT SIDE
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
// Queue to hold requests while refreshing
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

// Add Response Interceptor for global error handling & Refresh Token
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<{ message?: string; error?: string }>) => {
    const originalRequest = error.config as { _retry?: boolean } & typeof error.config;
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

    // 1. Handle 401 (Unauthorized) - Auto Refresh Token
    if (status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If already refreshing, queue this request
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then(() => {
            // Retry the original request after refresh completes
            return apiClient(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        if (isClient) {
          console.log('🔄 Token expired, attempting refresh...');
        }

        // Create a dedicated instance for auth calls to avoid circular deps and ensure credentials
        const authClient = axios.create({
          baseURL: API_URL,
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          },
        });

        // Call the Next.js Proxy Refresh Route
        const refreshResponse = await authClient.post('/auth/refresh');

        if (refreshResponse.status === 200) {
          if (isClient) {
            console.log('✅ Token refresh successful, retrying requests...');
          }
          processQueue(null); // Resolve all queued requests
          // Retry the original request with the new token
          return apiClient(originalRequest);
        }
      } catch (refreshError: unknown) {
        const refreshErr = refreshError as AxiosError;
        if (isClient) {
          console.error('❌ Token refresh failed:', refreshErr.response?.status);
        }
        processQueue(refreshError, null);
        // If refresh fails, we let the 401 error propagate.
        // The UI (AuthProvider) should listen to strict 401s or we can simply toast here.
        if (isClient) {
          toast.error('Session expired. Please login again.');
          // Optional: Redirect to login or let auth-provider handle it
          const path = window.location.pathname;
          if (
            !path.startsWith('/login') &&
            !path.startsWith('/register') &&
            !path.startsWith('/auth/login')
          ) {
            window.location.href = '/login';
          }
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Only show toasts on the client for other errors
    if (isClient) {
      switch (status) {
        case 403:
          toast.error('You do not have permission to perform this action.');
          break;
        case 500:
          toast.error('Server error. Please try again later.');
          break;
        case 401:
          // If we are here, it means 401 happened and retry failed or was not retried (e.g. refresh failed)
          // We already handled the refresh failure toast above if needed, but if it came from a non-retryable 401 (rare if logic is correct)
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
  },
);

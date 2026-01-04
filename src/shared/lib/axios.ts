import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

interface FailedQueueItem {
  resolve: (value?: unknown) => void;
  reject: (reason?: any) => void;
}

let isRefreshing = false;
let failedQueue: FailedQueueItem[] = [];

const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (!error.response || !originalRequest || originalRequest._retry) {
      return Promise.reject(error);
    }

    if (error.response.status !== 401) {
      return Promise.reject(error);
    }

    if (
      originalRequest.url?.includes("/auth/login") ||
      originalRequest.url?.includes("/auth/refresh") ||
      originalRequest.url?.includes("/auth/me")
    ) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then(() => apiClient(originalRequest))
        .catch((err) => Promise.reject(err));
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      await apiClient.post("/auth/refresh");

      processQueue(null);
      return apiClient(originalRequest);
    } catch (refreshError: any) {
      processQueue(refreshError, null);
      if (typeof window !== "undefined") {
        window.location.href = "/login?message=session_expired";
      }
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default apiClient;

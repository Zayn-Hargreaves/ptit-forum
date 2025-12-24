import axios, { AxiosError, AxiosRequestConfig } from "axios";

const getBaseUrl = (): string => {
  if (globalThis.window === undefined) {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!apiUrl?.startsWith("http")) {
      throw new Error(
        "NEXT_PUBLIC_API_URL must be an absolute URL for server-side requests"
      );
    }
    return apiUrl;
  }

  return process.env.NEXT_PUBLIC_API_URL || "/api";
};

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

export const apiClient = axios.create({
  baseURL: getBaseUrl(),
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & {
      _retry?: boolean;
    };

    if (
      error.response?.status !== 401 ||
      originalRequest._retry ||
      originalRequest.url?.includes("/auth/refresh")
    ) {
      throw error;
    }

    if (isRefreshing) {
      return new Promise(function (resolve, reject) {
        failedQueue.push({ resolve, reject });
      })
        .then(() => {
          return apiClient(originalRequest);
        })
        .catch((err) => {
          throw err;
        });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      await apiClient.post("/auth/refresh");

      processQueue(null);

      return apiClient(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError, null);

      if (
        globalThis.window !== undefined &&
        globalThis.location &&
        !globalThis.location.pathname.includes("/login")
      ) {
        globalThis.location.href = "/login?message=session_expired";
      }

      throw refreshError;
    } finally {
      isRefreshing = false;
    }
  }
);

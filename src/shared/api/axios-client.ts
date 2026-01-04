import axios from 'axios';

const getBaseUrl = (): string => {
  // Nếu ở Server, phải dùng URL đầy đủ của Backend (VD: Spring Boot, Node.js...)
  if (typeof window === 'undefined') {
    // Ưu tiên dùng biến môi trường riêng cho Server nếu cần,
    // hoặc dùng chung NEXT_PUBLIC_API_URL nhưng phải là FULL URL
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';
    return apiUrl;
  }
  // Nếu ở Client, dùng proxy /api để tránh CORS
  return '/api';
};

export const apiClient = axios.create({
  baseURL: getBaseUrl(),
  withCredentials: true,
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
        window.location.href = '/login?message=session_expired';
      }
    }
    return Promise.reject(error);
  }
);

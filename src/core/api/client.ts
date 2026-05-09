import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081/api/v1',
  withCredentials: true, // Required for HttpOnly cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response Interceptor: Global Error Handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Logic for session expiry: redirect to login
      if (typeof window !== 'undefined') {
        window.location.href = '/login?reason=expired';
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
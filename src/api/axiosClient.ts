import axios, {
   AxiosError,
   type AxiosInstance,
   type AxiosRequestConfig,
   type AxiosResponse,
} from "axios";

// Base URL
const baseURL =
   window.location.hostname === "localhost"
      ? "http://localhost:3000/api/v1"
      : "https://second-brain-dusky-two.vercel.app/api/v1";

// Axios instance
const api: AxiosInstance = axios.create({
   baseURL,
   withCredentials: true,
});

// Refresh handling
interface RetryAxiosRequestConfig extends AxiosRequestConfig {
   _retry?: boolean;
}

interface FailedRequest {
   resolve: () => void;
   reject: (error: unknown) => void;
}

let isRefreshing = false;
let failedQueue: FailedRequest[] = [];

const processQueue = (error: unknown | null) => {
   failedQueue.forEach(({ resolve, reject }) => {
      if (error) reject(error);
      else resolve();
   });
   failedQueue = [];
};

// FIX: Refresh Token call with proper syntax
const refreshTokens = async () => {
   return await axios.get(`${baseURL}/user/refresh-tokens`, {
      withCredentials: true,
   });
};

// Response interceptor
api.interceptors.response.use(
   (response: AxiosResponse) => response,
   async (error: AxiosError) => {
      const originalRequest = error.config as
         | RetryAxiosRequestConfig
         | undefined;

      // Safety check
      if (!originalRequest) {
         return Promise.reject(error);
      }

      // Do not retry on auth pages or if already retried
      if (
         window.location.pathname.includes("/auth") ||
         originalRequest._retry
      ) {
         return Promise.reject(error);
      }

      // Handle expired access token
      if (error.response?.status === 401 && !originalRequest._retry) {
         if (isRefreshing) {
            return new Promise<void>((resolve, reject) => {
               failedQueue.push({ resolve, reject });
            })
               .then(() => api(originalRequest))
               .catch((err) => Promise.reject(err));
         }

         originalRequest._retry = true;
         isRefreshing = true;

         try {
            await refreshTokens();
            processQueue(null);
            return api(originalRequest);
         } catch (refreshError) {
            processQueue(refreshError);
            // Notify app to logout
            window.dispatchEvent(new Event("auth:logout"));
            return Promise.reject(refreshError);
         } finally {
            isRefreshing = false;
         }
      }

      return Promise.reject(error);
   },
);

export default api;

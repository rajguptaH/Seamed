import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";

/**
 * Axios instance with JSON config.
 * You can extend it with baseURL, timeouts, etc.
 */
const axiosInstance: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "", // optional, for SSR or hosted API
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // ✅ useful for session-based auth
});

// ✅ Optional: attach token interceptor dynamically
axiosInstance.interceptors.request.use(
  (config) => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Generic API client with type inference
 */
export async function apiClient<T>(
  endpoint: string,
  options: AxiosRequestConfig = {}
): Promise<T> {
  try {
    const response: AxiosResponse<T> = await axiosInstance({
      url: endpoint,
      ...options,
    });
    return response.data;
  } catch (error: any) {
    console.error("API Error:", error.response?.data || error.message);
    throw new Error(
      error.response?.data?.message || error.message || "API request failed"
    );
  }
}

export { axiosInstance };

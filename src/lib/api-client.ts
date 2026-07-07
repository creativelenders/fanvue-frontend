import axios, {
  type AxiosError,
  type AxiosInstance,
  type InternalAxiosRequestConfig,
} from "axios";
import { useAuthStore } from "./auth-store";
import { useWorkspaceStore } from "./workspace-store";

const BASE_URL = import.meta.env["VITE_API_URL"] || "http://localhost:3001/api/v1";

class ApiClient {
  private client: AxiosInstance;
  private isRefreshing = false;
  private pendingRequests: Array<(token: string) => void> = [];

  constructor() {
    this.client = axios.create({
      baseURL: BASE_URL,
      timeout: 30000,
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // ── Request interceptor: attach access token ──
    this.client.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const token = useAuthStore.getState().accessToken;
        const workspaceId = useWorkspaceStore.getState().currentWorkspace?.id;

        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        if (workspaceId) {
          config.headers["X-Workspace-Id"] = workspaceId;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // ── Response interceptor: handle 401 with token refresh ──
    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & {
          _retry?: boolean;
        };

        if (error.response?.status === 401 && !originalRequest._retry) {
          const refreshToken = useAuthStore.getState().refreshToken;

          if (!refreshToken) {
            useAuthStore.getState().logout();
            return Promise.reject(error);
          }

          if (this.isRefreshing) {
            // Queue the request until refresh completes
            return new Promise((resolve) => {
              this.pendingRequests.push((token: string) => {
                originalRequest.headers.Authorization = `Bearer ${token}`;
                resolve(this.client(originalRequest));
              });
            });
          }

          originalRequest._retry = true;
          this.isRefreshing = true;

          try {
            const response = await axios.post(`${BASE_URL}/auth/refresh`, {
              refreshToken,
            });

            const { accessToken, refreshToken: newRefreshToken } = response.data.data;

            useAuthStore.getState().setTokens(accessToken, newRefreshToken);

            // Retry queued requests
            this.pendingRequests.forEach((cb) => cb(accessToken));
            this.pendingRequests = [];

            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
            return this.client(originalRequest);
          } catch {
            useAuthStore.getState().logout();
            throw error;
          } finally {
            this.isRefreshing = false;
          }
        }

        return Promise.reject(error);
      }
    );
  }

  get api(): AxiosInstance {
    return this.client;
  }
}

export const apiClient = new ApiClient();

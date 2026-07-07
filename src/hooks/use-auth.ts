import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../lib/api-client";
import { useAuthStore } from "../lib/auth-store";
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RefreshTokenResponse,
  ChangePasswordRequest,
  TwoFactorSetupResponse,
  UserProfile,
} from "../types/auth";
import type { ApiSuccess } from "../types/api";

// ── Login ──
export function useLogin() {
  const setTokens = useAuthStore((s) => s.setTokens);
  const setUser = useAuthStore((s) => s.setUser);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: LoginRequest): Promise<LoginResponse> => {
      const response = await apiClient.api.post<ApiSuccess<LoginResponse>>(
        "/auth/login",
        data
      );
      return response.data.data;
    },
    onSuccess: (data) => {
      setTokens(data.accessToken, data.refreshToken);
      setUser(data.user);
      queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
    },
  });
}

// ── Register ──
export function useRegister() {
  const setTokens = useAuthStore((s) => s.setTokens);
  const setUser = useAuthStore((s) => s.setUser);

  return useMutation({
    mutationFn: async (data: RegisterRequest): Promise<LoginResponse> => {
      const response = await apiClient.api.post<ApiSuccess<LoginResponse>>(
        "/auth/register",
        data
      );
      return response.data.data;
    },
    onSuccess: (data) => {
      setTokens(data.accessToken, data.refreshToken);
      setUser(data.user);
    },
  });
}

// ── Logout ──
export function useLogout() {
  const logout = useAuthStore((s) => s.logout);
  const accessToken = useAuthStore((s) => s.accessToken);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const refreshToken = useAuthStore.getState().refreshToken;
      await apiClient.api.post("/auth/logout", { refreshToken });
    },
    onSettled: () => {
      logout();
      queryClient.clear();
    },
  });
}

// ── Get Current User ──
export function useMe() {
  const setUser = useAuthStore((s) => s.setUser);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return useQuery({
    queryKey: ["auth", "me"],
    queryFn: async (): Promise<UserProfile> => {
      const response = await apiClient.api.get<ApiSuccess<UserProfile>>("/auth/me");
      return response.data.data;
    },
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000, // 5 min
    refetchOnWindowFocus: false,
    onSuccess: setUser,
  } as any);
}

// ── Change Password ──
export function useChangePassword() {
  return useMutation({
    mutationFn: async (data: ChangePasswordRequest): Promise<void> => {
      await apiClient.api.post("/auth/change-password", data);
    },
  });
}

// ── Setup 2FA ──
export function useSetup2FA() {
  return useMutation({
    mutationFn: async (): Promise<TwoFactorSetupResponse> => {
      const response = await apiClient.api.post<ApiSuccess<TwoFactorSetupResponse>>(
        "/auth/2fa/setup"
      );
      return response.data.data;
    },
  });
}

// ── Verify 2FA ──
export function useVerify2FA() {
  return useMutation({
    mutationFn: async (token: string): Promise<boolean> => {
      const response = await apiClient.api.post<ApiSuccess<{ verified: boolean }>>(
        "/auth/2fa/verify",
        { token }
      );
      return response.data.data.verified;
    },
  });
}

// ── Forgot Password ──
export function useForgotPassword() {
  return useMutation({
    mutationFn: async (email: string): Promise<void> => {
      await apiClient.api.post("/auth/forgot-password", { email });
    },
  });
}

// ── Reset Password ──
export function useResetPassword() {
  return useMutation({
    mutationFn: async (data: { token: string; newPassword: string }): Promise<void> => {
      await apiClient.api.post("/auth/reset-password", data);
    },
  });
}

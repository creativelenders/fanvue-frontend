import { useMutation, useQuery } from "@tanstack/react-query";
import { apiClient } from "../lib/api-client";
import type {
  TrackEventRequest,
  DashboardData,
  DashboardParams,
} from "../types/analytics";
import type { ApiSuccess } from "../types/api";

// ── Track Event ──
export function useTrackEvent() {
  return useMutation({
    mutationFn: async (data: TrackEventRequest): Promise<void> => {
      await apiClient.api.post("/analytics/track", data);
    },
  });
}

// ── Dashboard Data ──
export function useDashboard(params: DashboardParams) {
  return useQuery({
    queryKey: ["analytics", "dashboard", params],
    queryFn: async (): Promise<DashboardData> => {
      const searchParams = new URLSearchParams({
        period: params.period,
      });
      if (params.platform) {
        searchParams.set("platform", params.platform);
      }

      const response = await apiClient.api.get<ApiSuccess<DashboardData>>(
        `/analytics/dashboard?${searchParams.toString()}`
      );
      return response.data.data;
    },
    refetchInterval: 30_000, // Poll every 30s for real-time feel
  });
}

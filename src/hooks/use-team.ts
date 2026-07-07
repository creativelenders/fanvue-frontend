import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../lib/api-client";
import type { ApiSuccess } from "../types/api";
import type {
  ChatterShift,
  ShiftSchedule,
  CoverageData,
  LeaderboardEntry,
} from "../types/team";

// ── Shifts ──
export function useShifts(workspaceId: string) {
  return useQuery({
    queryKey: ["shifts", workspaceId],
    queryFn: async (): Promise<ChatterShift[]> => {
      const response = await apiClient.api.get<ApiSuccess<ChatterShift[]>>(
        `/workspaces/${workspaceId}/shifts`
      );
      return response.data.data;
    },
    enabled: !!workspaceId,
    refetchInterval: 30_000,
  });
}

export function useStartShift() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (workspaceId: string) => {
      const response = await apiClient.api.post<ApiSuccess<ChatterShift>>(
        `/workspaces/${workspaceId}/shifts/start`
      );
      return response.data.data;
    },
    onSuccess: (_data, workspaceId) => {
      queryClient.invalidateQueries({ queryKey: ["shifts", workspaceId] });
    },
  });
}

export function useEndShift() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      workspaceId,
      shiftId,
    }: {
      workspaceId: string;
      shiftId: string;
    }) => {
      const response = await apiClient.api.post(
        `/workspaces/${workspaceId}/shifts/${shiftId}/end`
      );
      return response.data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["shifts", variables.workspaceId] });
      queryClient.invalidateQueries({ queryKey: ["leaderboard", variables.workspaceId] });
    },
  });
}

// ── Leaderboard ──
export function useLeaderboard(workspaceId: string) {
  return useQuery({
    queryKey: ["leaderboard", workspaceId],
    queryFn: async (): Promise<LeaderboardEntry[]> => {
      const response = await apiClient.api.get<ApiSuccess<LeaderboardEntry[]>>(
        `/workspaces/${workspaceId}/leaderboard`
      );
      return response.data.data;
    },
    enabled: !!workspaceId,
  });
}

// ── Schedules ──
export function useSchedules(workspaceId: string) {
  return useQuery({
    queryKey: ["schedules", workspaceId],
    queryFn: async (): Promise<ShiftSchedule[]> => {
      const response = await apiClient.api.get<ApiSuccess<ShiftSchedule[]>>(
        `/workspaces/${workspaceId}/schedules`
      );
      return response.data.data;
    },
    enabled: !!workspaceId,
  });
}

export function useCoverage(workspaceId: string) {
  return useQuery({
    queryKey: ["schedules", workspaceId, "coverage"],
    queryFn: async (): Promise<CoverageData> => {
      const response = await apiClient.api.get<ApiSuccess<CoverageData>>(
        `/workspaces/${workspaceId}/schedules/coverage`
      );
      return response.data.data;
    },
    enabled: !!workspaceId,
  });
}

export function useCreateSchedule() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ workspaceId, data }: { workspaceId: string, data: any }) => {
      const response = await apiClient.api.post(
        `/workspaces/${workspaceId}/schedules`,
        data
      );
      return response.data.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["schedules", variables.workspaceId] });
    }
  });
}

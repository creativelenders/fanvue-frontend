import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../lib/api-client";
import type { ApiSuccess, PaginatedResponse } from "../types/api";
import type {
  Fan,
  FanListQuery,
  AddFanRequest,
  UpdateFanRequest,
  FanList,
  CreateFanListRequest,
  FanTag,
  FanActivity,
} from "../types/fans";

// ── List Fans ──
export function useFans(workspaceId: string, query: FanListQuery) {
  return useQuery({
    queryKey: ["fans", workspaceId, query],
    queryFn: async (): Promise<PaginatedResponse<Fan>> => {
      const params = new URLSearchParams();
      Object.entries(query).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          params.set(key, String(value));
        }
      });
      const response = await apiClient.api.get<ApiSuccess<PaginatedResponse<Fan>>>(
        `/workspaces/${workspaceId}/fans?${params.toString()}`
      );
      return response.data.data;
    },
    enabled: !!workspaceId,
  });
}

// ── Get Fan By ID ──
export function useFanById(workspaceId: string, fanId: string) {
  return useQuery({
    queryKey: ["fans", workspaceId, fanId],
    queryFn: async (): Promise<Fan> => {
      const response = await apiClient.api.get<ApiSuccess<Fan>>(
        `/workspaces/${workspaceId}/fans/${fanId}`
      );
      return response.data.data;
    },
    enabled: !!workspaceId && !!fanId,
  });
}

// ── Add Fan ──
export function useAddFan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      workspaceId,
      data,
    }: {
      workspaceId: string;
      data: AddFanRequest;
    }): Promise<Fan> => {
      const response = await apiClient.api.post<ApiSuccess<Fan>>(
        `/workspaces/${workspaceId}/fans`,
        data
      );
      return response.data.data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["fans", variables.workspaceId] });
    },
  });
}

// ── Update Fan ──
export function useUpdateFan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      workspaceId,
      fanId,
      data,
    }: {
      workspaceId: string;
      fanId: string;
      data: UpdateFanRequest;
    }): Promise<Fan> => {
      const response = await apiClient.api.patch<ApiSuccess<Fan>>(
        `/workspaces/${workspaceId}/fans/${fanId}`,
        data
      );
      return response.data.data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["fans", variables.workspaceId] });
    },
  });
}

// ── Delete Fan ──
export function useDeleteFan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      workspaceId,
      fanId,
    }: {
      workspaceId: string;
      fanId: string;
    }) => {
      await apiClient.api.delete(`/workspaces/${workspaceId}/fans/${fanId}`);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["fans", variables.workspaceId] });
    },
  });
}

// ── Rescore All Fans ──
export function useRescoreAllFans() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (workspaceId: string) => {
      const response = await apiClient.api.post(
        `/workspaces/${workspaceId}/fans/rescore-all`
      );
      return response.data;
    },
    onSuccess: (_data, workspaceId) => {
      queryClient.invalidateQueries({ queryKey: ["fans", workspaceId] });
    },
  });
}

// ── Fan Activity ──
export function useFanActivity(workspaceId: string, fanId: string) {
  return useQuery({
    queryKey: ["fans", workspaceId, fanId, "activity"],
    queryFn: async (): Promise<FanActivity[]> => {
      const response = await apiClient.api.get<ApiSuccess<FanActivity[]>>(
        `/workspaces/${workspaceId}/fans/${fanId}/activity`
      );
      return response.data.data;
    },
    enabled: !!workspaceId && !!fanId,
  });
}

// ── Fan Lists ──
export function useFanLists(workspaceId: string) {
  return useQuery({
    queryKey: ["fan-lists", workspaceId],
    queryFn: async (): Promise<FanList[]> => {
      const response = await apiClient.api.get<ApiSuccess<FanList[]>>(
        `/workspaces/${workspaceId}/fan-lists`
      );
      return response.data.data;
    },
    enabled: !!workspaceId,
  });
}

export function useCreateFanList() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      workspaceId,
      data,
    }: {
      workspaceId: string;
      data: CreateFanListRequest;
    }): Promise<FanList> => {
      const response = await apiClient.api.post<ApiSuccess<FanList>>(
        `/workspaces/${workspaceId}/fan-lists`,
        data
      );
      return response.data.data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["fan-lists", variables.workspaceId] });
    },
  });
}

// ── Fan Tags ──
export function useFanTags(workspaceId: string) {
  return useQuery({
    queryKey: ["fan-tags", workspaceId],
    queryFn: async (): Promise<FanTag[]> => {
      const response = await apiClient.api.get<ApiSuccess<FanTag[]>>(
        `/workspaces/${workspaceId}/fan-tags`
      );
      return response.data.data;
    },
    enabled: !!workspaceId,
  });
}

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../lib/api-client";
import type { AiModel, UpdateModelRequest, UsageStats } from "../types/models";
import type { ApiSuccess } from "../types/api";
import type { Period } from "../types/common";

// ── List All Models ──
export function useModels() {
  return useQuery({
    queryKey: ["models"],
    queryFn: async (): Promise<AiModel[]> => {
      const response = await apiClient.api.get<ApiSuccess<AiModel[]>>("/models");
      return response.data.data;
    },
    staleTime: 60_000,
  });
}

// ── Get Model By ID ──
export function useModelById(id: string) {
  return useQuery({
    queryKey: ["models", id],
    queryFn: async (): Promise<AiModel> => {
      const response = await apiClient.api.get<ApiSuccess<AiModel>>(`/models/${id}`);
      return response.data.data;
    },
    enabled: !!id,
  });
}

// ── Update Model ──
export function useUpdateModel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: UpdateModelRequest;
    }): Promise<AiModel> => {
      const response = await apiClient.api.patch<ApiSuccess<AiModel>>(
        `/models/${id}`,
        data
      );
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["models"] });
    },
  });
}

// ── Usage Stats ──
export function useUsageStats(period: Period = "7d", modelId?: string) {
  return useQuery({
    queryKey: ["models", "usage", period, modelId],
    queryFn: async (): Promise<UsageStats> => {
      const searchParams = new URLSearchParams({ period });
      if (modelId) searchParams.set("modelId", modelId);

      const response = await apiClient.api.get<ApiSuccess<UsageStats>>(
        `/models/usage/stats?${searchParams.toString()}`
      );
      return response.data.data;
    },
    refetchInterval: 60_000,
  });
}

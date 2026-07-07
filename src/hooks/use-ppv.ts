import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../lib/api-client";
import type { ApiSuccess } from "../types/api";

export interface PpvItem {
  id: string;
  name: string;
  price: string;
  mediaType: string;
  totalSent: number;
  totalPurchased: number;
  revenue: string;
  createdAt: string;
}

export function usePpv(workspaceId: string) {
  return useQuery({
    queryKey: ["ppv", workspaceId],
    queryFn: async (): Promise<PpvItem[]> => {
      const response = await apiClient.api.get<ApiSuccess<PpvItem[]>>(
        `/workspaces/${workspaceId}/ppv`
      );
      return response.data.data;
    },
    enabled: !!workspaceId,
  });
}

export function useAddPpv() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ workspaceId, data }: { workspaceId: string, data: any }): Promise<PpvItem> => {
      const response = await apiClient.api.post<ApiSuccess<PpvItem>>(
        `/workspaces/${workspaceId}/ppv`,
        data
      );
      return response.data.data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["ppv", variables.workspaceId] });
    },
  });
}

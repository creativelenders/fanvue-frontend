import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../lib/api-client";
import type { ApiSuccess } from "../types/api";

export function useTrafficLinks(workspaceId: string) {
  return useQuery({
    queryKey: ["trafficLinks", workspaceId],
    queryFn: async (): Promise<any[]> => {
      const response = await apiClient.api.get<ApiSuccess<any[]>>(
        `/workspaces/${workspaceId}/traffic/links`
      );
      return response.data.data;
    },
    enabled: !!workspaceId,
  });
}

export function useCreateTrafficLink() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (workspaceId: string) => {
      const response = await apiClient.api.post(`/workspaces/${workspaceId}/traffic/links`);
      return response.data.data;
    },
    onSuccess: (_, workspaceId) => queryClient.invalidateQueries({ queryKey: ["trafficLinks", workspaceId] })
  });
}

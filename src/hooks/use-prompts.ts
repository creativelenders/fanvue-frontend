import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../lib/api-client";
import type { ApiSuccess } from "../types/api";

export interface Prompt {
  id: string;
  name: string;
  content: string;
  category: string | null;
  createdAt: string;
}

export function usePrompts() {
  return useQuery({
    queryKey: ["prompts"],
    queryFn: async (): Promise<Prompt[]> => {
      const response = await apiClient.api.get<ApiSuccess<Prompt[]>>("/prompts");
      return response.data.data;
    },
  });
}

export function useCreatePrompt() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { name: string; content: string; category?: string }): Promise<Prompt> => {
      const response = await apiClient.api.post<ApiSuccess<Prompt>>("/prompts", data);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["prompts"] });
    },
  });
}

export function useDeletePrompt() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      await apiClient.api.delete(`/prompts/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["prompts"] });
    },
  });
}

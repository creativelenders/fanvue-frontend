import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../lib/api-client";
import type {
  GenerateContentRequest,
  GenerateContentResponse,
  BatchGenerateRequest,
  ContentItem,
  ContentListParams,
  ContentStrategy,
} from "../types/content";
import type { ApiSuccess, PaginatedResponse } from "../types/api";

// ── Generate Content ──
export function useGenerateContent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: GenerateContentRequest): Promise<GenerateContentResponse> => {
      const response = await apiClient.api.post<ApiSuccess<GenerateContentResponse>>(
        "/content/generate",
        data
      );
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["content"] });
    },
  });
}

// ── Batch Generate ──
export function useBatchGenerate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: BatchGenerateRequest): Promise<GenerateContentResponse[]> => {
      const response = await apiClient.api.post<ApiSuccess<GenerateContentResponse[]>>(
        "/content/batch-generate",
        data
      );
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["content"] });
    },
  });
}

// ── List Content ──
export function useContentList(params: ContentListParams) {
  return useQuery({
    queryKey: ["content", params],
    queryFn: async (): Promise<PaginatedResponse<ContentItem>> => {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          searchParams.set(key, String(value));
        }
      });

      const response = await apiClient.api.get<ApiSuccess<PaginatedResponse<ContentItem>>>(
        `/content?${searchParams.toString()}`
      );
      return response.data.data;
    },
    staleTime: 30_000,
  });
}

// ── Get Single Content ──
export function useContentById(id: string) {
  return useQuery({
    queryKey: ["content", id],
    queryFn: async (): Promise<ContentItem> => {
      const response = await apiClient.api.get<ApiSuccess<ContentItem>>(`/content/${id}`);
      return response.data.data;
    },
    enabled: !!id,
  });
}

// ── Delete Content ──
export function useDeleteContent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      await apiClient.api.delete(`/content/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["content"] });
    },
  });
}

// ── List Personas ──
export function usePersonas() {
  return useQuery({
    queryKey: ["content", "personas"],
    queryFn: async (): Promise<any[]> => {
      const response = await apiClient.api.get<ApiSuccess<any[]>>("/content/personas");
      return response.data.data;
    },
  });
}

// ── List Generations ──
export function useGenerations() {
  return useQuery({
    queryKey: ["content", "generations"],
    queryFn: async (): Promise<any[]> => {
      const response = await apiClient.api.get<ApiSuccess<any[]>>("/content/generations");
      return response.data.data;
    },
  });
}

// ── Train Persona ──
export function useTrainPersona() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { description: string }): Promise<any> => {
      const response = await apiClient.api.post<ApiSuccess<any>>("/content/persona/train", data);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["content", "personas"] });
    },
  });
}

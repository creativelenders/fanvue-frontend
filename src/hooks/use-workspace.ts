import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../lib/api-client";
import { useAuthStore } from "../lib/auth-store";
import type { ApiSuccess } from "../types/api";
import type {
  Workspace,
  WorkspaceMember,
  CreateWorkspaceRequest,
  InviteMemberRequest,
} from "../types/workspace";

// ── List User Workspaces ──
export function useListWorkspaces() {
  return useQuery({
    queryKey: ["workspaces"],
    queryFn: async (): Promise<Workspace[]> => {
      const response = await apiClient.api.get<ApiSuccess<Workspace[]>>("/workspaces");
      return response.data.data;
    },
    enabled: useAuthStore.getState().isAuthenticated,
    staleTime: 60_000,
  });
}

// ── Get Workspace ──
export function useWorkspaceById(workspaceId: string) {
  return useQuery({
    queryKey: ["workspaces", workspaceId],
    queryFn: async (): Promise<Workspace> => {
      const response = await apiClient.api.get<ApiSuccess<Workspace>>(`/workspaces/${workspaceId}`);
      return response.data.data;
    },
    enabled: !!workspaceId,
  });
}

// ── Create Workspace ──
export function useCreateWorkspace() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateWorkspaceRequest): Promise<Workspace> => {
      const response = await apiClient.api.post<ApiSuccess<Workspace>>("/workspaces", data);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
    },
  });
}

// ── Update Workspace ──
export function useUpdateWorkspace() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ workspaceId, data }: { workspaceId: string; data: Partial<Workspace> }) => {
      const response = await apiClient.api.put<ApiSuccess<Workspace>>(`/workspaces/${workspaceId}`, data);
      return response.data.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
      queryClient.invalidateQueries({ queryKey: ["workspaces", variables.workspaceId] });
    },
  });
}

// ── Delete Workspace ──
export function useDeleteWorkspace() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (workspaceId: string) => {
      const response = await apiClient.api.delete(`/workspaces/${workspaceId}`);
      return response.data;
    },
    onSuccess: (_, workspaceId) => {
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
      queryClient.removeQueries({ queryKey: ["workspaces", workspaceId] });
    },
  });
}

// ── Get Workspace Members ──
export function useWorkspaceMembers(workspaceId: string) {
  return useQuery({
    queryKey: ["workspaces", workspaceId, "members"],
    queryFn: async (): Promise<WorkspaceMember[]> => {
      const response = await apiClient.api.get<ApiSuccess<WorkspaceMember[]>>(
        `/workspaces/${workspaceId}/members`
      );
      return response.data.data;
    },
    enabled: !!workspaceId,
  });
}

// ── Invite Member ──
export function useInviteMember() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      workspaceId,
      data,
    }: {
      workspaceId: string;
      data: InviteMemberRequest;
    }) => {
      const response = await apiClient.api.post(
        `/workspaces/${workspaceId}/invite`,
        data
      );
      return response.data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["workspaces", variables.workspaceId, "members"],
      });
    },
  });
}

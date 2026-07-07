import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../lib/api-client";
import type { ApiSuccess } from "../types/api";
import type {
  AutopilotConfig,
  Flow,
  KeywordTrigger,
  GuardWord,
  BumpRule,
  BroadcastCampaign,
  SocialFunnel,
} from "../types/automation";

// ── Autopilot ──
export function useAutopilotConfig(workspaceId: string) {
  return useQuery({
    queryKey: ["autopilot", workspaceId],
    queryFn: async (): Promise<AutopilotConfig> => {
      const response = await apiClient.api.get<ApiSuccess<AutopilotConfig>>(
        `/workspaces/${workspaceId}/autopilot`
      );
      return response.data.data;
    },
    enabled: !!workspaceId,
  });
}

export function useUpdateAutopilot() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      workspaceId,
      data,
    }: {
      workspaceId: string;
      data: Partial<AutopilotConfig>;
    }): Promise<AutopilotConfig> => {
      const response = await apiClient.api.put<ApiSuccess<AutopilotConfig>>(
        `/workspaces/${workspaceId}/autopilot`,
        data
      );
      return response.data.data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["autopilot", variables.workspaceId] });
    },
  });
}

// ── Flows ──
export function useFlows(workspaceId: string) {
  return useQuery({
    queryKey: ["flows", workspaceId],
    queryFn: async (): Promise<Flow[]> => {
      const response = await apiClient.api.get<ApiSuccess<Flow[]>>(
        `/workspaces/${workspaceId}/flows`
      );
      return response.data.data;
    },
    enabled: !!workspaceId,
  });
}

export function useFlow(workspaceId: string, flowId: string) {
  return useQuery({
    queryKey: ["flow", workspaceId, flowId],
    queryFn: async (): Promise<Flow> => {
      const response = await apiClient.api.get<ApiSuccess<Flow>>(
        `/workspaces/${workspaceId}/flows/${flowId}`
      );
      return response.data.data;
    },
    enabled: !!workspaceId && !!flowId,
  });
}

export function useUpdateFlow() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ workspaceId, flowId, updates }: { workspaceId: string, flowId: string, updates: any }) => {
      const response = await apiClient.api.put(`/workspaces/${workspaceId}/flows/${flowId}`, updates);
      return response.data.data;
    },
    onSuccess: (_, { workspaceId, flowId }) => {
      queryClient.invalidateQueries({ queryKey: ["flow", workspaceId, flowId] });
      queryClient.invalidateQueries({ queryKey: ["flows", workspaceId] });
    }
  });
}

export function useFlowById(workspaceId: string, flowId: string) {
  return useQuery({
    queryKey: ["flows", workspaceId, flowId],
    queryFn: async (): Promise<Flow> => {
      const response = await apiClient.api.get<ApiSuccess<Flow>>(
        `/workspaces/${workspaceId}/flows/${flowId}`
      );
      return response.data.data;
    },
    enabled: !!workspaceId && !!flowId,
  });
}

// ── Triggers ──
export function useTriggers(workspaceId: string) {
  return useQuery({
    queryKey: ["triggers", workspaceId],
    queryFn: async (): Promise<KeywordTrigger[]> => {
      const response = await apiClient.api.get<ApiSuccess<KeywordTrigger[]>>(
        `/workspaces/${workspaceId}/triggers`
      );
      return response.data.data;
    },
    enabled: !!workspaceId,
  });
}

// ── Message Guard ──
export function useGuardWords(workspaceId: string) {
  return useQuery({
    queryKey: ["message-guard", workspaceId],
    queryFn: async (): Promise<GuardWord[]> => {
      const response = await apiClient.api.get<ApiSuccess<GuardWord[]>>(
        `/workspaces/${workspaceId}/message-guard`
      );
      return response.data.data;
    },
    enabled: !!workspaceId,
  });
}

// ── Bumps ──
export function useBumpRules(workspaceId: string) {
  return useQuery({
    queryKey: ["bumps", workspaceId],
    queryFn: async (): Promise<BumpRule[]> => {
      const response = await apiClient.api.get<ApiSuccess<BumpRule[]>>(
        `/workspaces/${workspaceId}/bumps`
      );
      return response.data.data;
    },
    enabled: !!workspaceId,
  });
}

// ── Broadcasts ──
export function useBroadcasts(workspaceId: string) {
  return useQuery({
    queryKey: ["broadcasts", workspaceId],
    queryFn: async (): Promise<BroadcastCampaign[]> => {
      const response = await apiClient.api.get<ApiSuccess<BroadcastCampaign[]>>(
        `/workspaces/${workspaceId}/broadcasts`
      );
      return response.data.data;
    },
    enabled: !!workspaceId,
  });
}

// ── Social Funnels ──
export function useSocialFunnels(workspaceId: string) {
  return useQuery({
    queryKey: ["social-funnels", workspaceId],
    queryFn: async (): Promise<SocialFunnel[]> => {
      const response = await apiClient.api.get<ApiSuccess<SocialFunnel[]>>(
        `/workspaces/${workspaceId}/social-funnels`
      );
      return response.data.data;
    },
    enabled: !!workspaceId,
  });
}

// ── Auto Messages ──
export function useAutoMessages(workspaceId: string) {
  return useQuery({
    queryKey: ["auto-messages", workspaceId],
    queryFn: async () => {
      const response = await apiClient.api.get<ApiSuccess<any[]>>(
        `/workspaces/${workspaceId}/auto-messages`
      );
      return response.data.data;
    },
    enabled: !!workspaceId,
  });
}

export function useCreateFlow() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (workspaceId: string) => {
      const response = await apiClient.api.post(`/workspaces/${workspaceId}/flows`);
      return response.data.data;
    },
    onSuccess: (_, workspaceId) => queryClient.invalidateQueries({ queryKey: ["flows", workspaceId] })
  });
}

export function useCreateTrigger() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (workspaceId: string) => {
      const response = await apiClient.api.post(`/workspaces/${workspaceId}/triggers`);
      return response.data.data;
    },
    onSuccess: (_, workspaceId) => queryClient.invalidateQueries({ queryKey: ["triggers", workspaceId] })
  });
}

export function useAddGuardWord() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (workspaceId: string) => {
      const response = await apiClient.api.post(`/workspaces/${workspaceId}/message-guard`);
      return response.data.data;
    },
    onSuccess: (_, workspaceId) => queryClient.invalidateQueries({ queryKey: ["message-guard", workspaceId] })
  });
}

export function useCreateBumpRule() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (workspaceId: string) => {
      const response = await apiClient.api.post(`/workspaces/${workspaceId}/bumps`);
      return response.data.data;
    },
    onSuccess: (_, workspaceId) => queryClient.invalidateQueries({ queryKey: ["bumps", workspaceId] })
  });
}

export function useCreateBroadcast() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (workspaceId: string) => {
      const response = await apiClient.api.post(`/workspaces/${workspaceId}/broadcasts`);
      return response.data.data;
    },
    onSuccess: (_, workspaceId) => queryClient.invalidateQueries({ queryKey: ["broadcasts", workspaceId] })
  });
}

export function useCreateAutoMessage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (workspaceId: string) => {
      const response = await apiClient.api.post(`/workspaces/${workspaceId}/auto-messages`);
      return response.data.data;
    },
    onSuccess: (_, workspaceId) => queryClient.invalidateQueries({ queryKey: ["auto-messages", workspaceId] })
  });
}

export function useCreateSocialFunnel() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (workspaceId: string) => {
      const response = await apiClient.api.post(`/workspaces/${workspaceId}/social-funnels`);
      return response.data.data;
    },
    onSuccess: (_, workspaceId) => queryClient.invalidateQueries({ queryKey: ["social-funnels", workspaceId] })
  });
}

export function useOnboardingFunnels(workspaceId: string) {
  return useQuery({
    queryKey: ["onboardingFunnels", workspaceId],
    queryFn: async (): Promise<any[]> => {
      const response = await apiClient.api.get<ApiSuccess<any[]>>(
        `/workspaces/${workspaceId}/onboarding`
      );
      return response.data.data;
    },
    enabled: !!workspaceId,
  });
}

export function useCreateOnboardingFunnel() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (workspaceId: string) => {
      const response = await apiClient.api.post(`/workspaces/${workspaceId}/onboarding`);
      return response.data.data;
    },
    onSuccess: (_, workspaceId) => queryClient.invalidateQueries({ queryKey: ["onboardingFunnels", workspaceId] })
  });
}

export function useOnboardingFunnel(workspaceId: string, funnelId: string) {
  return useQuery({
    queryKey: ["onboardingFunnel", workspaceId, funnelId],
    queryFn: async (): Promise<any> => {
      const response = await apiClient.api.get<ApiSuccess<any>>(
        `/workspaces/${workspaceId}/onboarding/${funnelId}`
      );
      return response.data.data;
    },
    enabled: !!workspaceId && !!funnelId,
  });
}

export function useUpdateOnboardingFunnel() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ workspaceId, funnelId, updates }: { workspaceId: string, funnelId: string, updates: any }) => {
      const response = await apiClient.api.put(`/workspaces/${workspaceId}/onboarding/${funnelId}`, updates);
      return response.data.data;
    },
    onSuccess: (_, { workspaceId, funnelId }) => {
      queryClient.invalidateQueries({ queryKey: ["onboardingFunnel", workspaceId, funnelId] });
      queryClient.invalidateQueries({ queryKey: ["onboardingFunnels", workspaceId] });
    }
  });
}

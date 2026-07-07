import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../lib/api-client";
import type { ApiSuccess } from "../types/api";
import type {
  SubscriptionPlan,
  WorkspaceSubscription,
  UsageData,
  Invoice,
} from "../types/billing";

// ── List Plans ──
export function usePlans() {
  return useQuery({
    queryKey: ["plans"],
    queryFn: async (): Promise<SubscriptionPlan[]> => {
      const response = await apiClient.api.get<ApiSuccess<SubscriptionPlan[]>>("/plans");
      return response.data.data;
    },
    staleTime: 10 * 60 * 1000,
  });
}

// ── Subscription ──
export function useSubscription(workspaceId: string) {
  return useQuery({
    queryKey: ["subscription", workspaceId],
    queryFn: async (): Promise<WorkspaceSubscription> => {
      const response = await apiClient.api.get<ApiSuccess<WorkspaceSubscription>>(
        `/workspaces/${workspaceId}/subscription`
      );
      return response.data.data;
    },
    enabled: !!workspaceId,
  });
}

// ── Usage ──
export function useUsage(workspaceId: string) {
  return useQuery({
    queryKey: ["usage", workspaceId],
    queryFn: async (): Promise<UsageData> => {
      const response = await apiClient.api.get<ApiSuccess<UsageData>>(
        `/workspaces/${workspaceId}/usage`
      );
      return response.data.data;
    },
    enabled: !!workspaceId,
  });
}

// ── Change Plan ──
export function useChangePlan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      workspaceId,
      planId,
    }: {
      workspaceId: string;
      planId: string;
    }) => {
      const response = await apiClient.api.post(
        `/workspaces/${workspaceId}/subscription/change-plan`,
        { planId }
      );
      return response.data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["subscription", variables.workspaceId] });
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
      queryClient.invalidateQueries({ queryKey: ["usage", variables.workspaceId] });
    },
  });
}

// ── Invoices ──
export function useInvoices(workspaceId: string) {
  return useQuery({
    queryKey: ["invoices", workspaceId],
    queryFn: async (): Promise<Invoice[]> => {
      const response = await apiClient.api.get<ApiSuccess<Invoice[]>>(
        `/workspaces/${workspaceId}/invoices`
      );
      return response.data.data;
    },
    enabled: !!workspaceId,
  });
}

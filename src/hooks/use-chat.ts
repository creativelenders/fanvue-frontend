import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../lib/api-client";
import type { ApiSuccess } from "../types/api";

export interface ChatThread {
  id: string;
  fanId: string;
  fanName: string;
  lastMessage: string;
  unreadCount: number;
  updatedAt: string;
}

export function useChatThreads(workspaceId: string) {
  return useQuery({
    queryKey: ["chat", workspaceId],
    queryFn: async (): Promise<ChatThread[]> => {
      const response = await apiClient.api.get<ApiSuccess<ChatThread[]>>(
        `/workspaces/${workspaceId}/chat`
      );
      return response.data.data;
    },
    enabled: !!workspaceId,
  });
}

export interface ChatMessage {
  id: string;
  sessionId: string;
  role: "user" | "assistant" | "system";
  content: string;
  createdAt: string;
}

export function useChatMessages(threadId: string) {
  return useQuery({
    queryKey: ["chat", threadId, "messages"],
    queryFn: async (): Promise<ChatMessage[]> => {
      const response = await apiClient.api.get<ApiSuccess<ChatMessage[]>>(
        `/chat/${threadId}/messages`
      );
      return response.data.data;
    },
    enabled: !!threadId,
  });
}

export function useSendMessage(threadId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { content: string }): Promise<ChatMessage> => {
      const response = await apiClient.api.post<ApiSuccess<ChatMessage>>(
        `/chat/${threadId}/messages`,
        data
      );
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chat", threadId, "messages"] });
      queryClient.invalidateQueries({ queryKey: ["chat"] }); // update thread list lastMessage
    },
  });
}

export function useDraftReply(threadId: string) {
  return useMutation({
    mutationFn: async (): Promise<{ draft: string }> => {
      const response = await apiClient.api.post<ApiSuccess<{ draft: string }>>(
        `/chat/${threadId}/draft`
      );
      return response.data.data;
    },
  });
}

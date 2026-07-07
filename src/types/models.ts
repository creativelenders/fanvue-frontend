export interface AiModel {
  id: string;
  slug: string;
  name: string;
  provider: string;
  modelVersion: string | null;
  capabilities: {
    creativity: number;
    reasoning: number;
    logic: number;
    speed: number;
  };
  costPerRequest: string;
  contextWindow: number;
  isActive: boolean;
  createdAt: string;
}

export interface UpdateModelRequest {
  isActive?: boolean;
  costPerRequest?: string;
  capabilities?: Partial<AiModel["capabilities"]>;
}

export interface UsageStats {
  totalRequests: number;
  totalTokens: number;
  totalCost: string;
  modelBreakdown: Array<{
    modelName: string;
    requests: number;
    tokens: number;
    cost: string;
    avgLatencyMs: number;
  }>;
}

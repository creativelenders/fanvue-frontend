

export interface GenerateContentRequest {
  prompt: string;
  strategySlug: string;
  platform?: string;
  aiModelSlug?: string;
  tone?: string;
  targetAudience?: string;
  variations?: number;
  metadata?: Record<string, unknown>;
}

export interface GenerateContentResponse {
  id: string;
  generatedContent: string;
  strategy: { id: string; name: string };
  aiModel: { id: string; name: string; provider: string };
  riskScore: number | null;
  costIncurred: string;
  tokensUsed: number;
  latencyMs: number;
  metadata: Record<string, unknown>;
  createdAt: string;
}

export interface BatchGenerateRequest {
  prompts: string[];
  strategySlug: string;
  platform?: string;
  aiModelSlug?: string;
}

export interface ContentItem {
  id: string;
  userId: string;
  prompt: string;
  generatedContent: string;
  strategy: { id: string; name: string };
  aiModel: { id: string; name: string; provider: string };
  riskScore: number | null;
  complianceApproved: boolean | null;
  costIncurred: string;
  tokensUsed: number;
  latencyMs: number;
  metadata: Record<string, unknown>;
  isArchived: boolean;
  createdAt: string;
}

export interface ContentListParams {
  page?: number;
  limit?: number;
  sort?: "createdAt" | "tokensUsed" | "costIncurred";
  order?: "asc" | "desc";
  strategyId?: string;
  isArchived?: boolean;
  search?: string;
  startDate?: string;
  endDate?: string;
}

export interface ContentStrategy {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  platform: string;
  hooks: string[];
  captions: string[];
  ctas: string[];
  isBuiltIn: boolean;
  createdAt: string;
}

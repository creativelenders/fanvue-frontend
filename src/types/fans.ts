export interface Fan {
  id: string;
  name: string | null;
  handle: string | null;
  platform: string | null;
  status: FanStatus;
  score: number;
  totalSpend: string;
  avgSpend: string;
  totalMessages: number;
  lastActiveAt: string | null;
  subscribedAt: string | null;
  notes: string | null;
  tags: FanTag[];
  createdAt: string;
}

export type FanStatus = "active" | "expired" | "churned" | "pending";

export interface AddFanRequest {
  name?: string;
  handle?: string;
  platform?: string;
  platformId?: string;
  status?: FanStatus;
  notes?: string;
  metadata?: Record<string, unknown>;
}

export type UpdateFanRequest = Partial<AddFanRequest>;

export interface FanListQuery {
  page?: number;
  limit?: number;
  sort?: "score" | "totalSpend" | "lastActiveAt" | "createdAt";
  order?: "asc" | "desc";
  status?: FanStatus;
  search?: string;
  minScore?: number;
  maxScore?: number;
  tagId?: string;
}

export interface FanList {
  id: string;
  name: string;
  description: string | null;
  isDynamic: boolean;
  totalFans: number;
  memberCount: number;
  createdAt: string;
}

export interface CreateFanListRequest {
  name: string;
  description?: string;
  isDynamic?: boolean;
  dynamicCriteria?: {
    minScore?: number;
    maxScore?: number;
    minSpend?: number;
    status?: string[];
    tags?: string[];
    platforms?: string[];
    lastActiveWithinDays?: number;
  };
}

export interface FanTag {
  id: string;
  name: string;
  color: string;
}

export interface FanActivity {
  id: string;
  activityType: string;
  description: string | null;
  value: string | null;
  occurredAt: string;
}

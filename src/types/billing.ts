export interface SubscriptionPlan {
  id: string;
  slug: string;
  name: string;
  price: string;
  aiGenerationsLimit: number;
  socialPlatforms: number;
  seats: number;
  hasAdvancedAnalytics: boolean;
  hasApiAccess: boolean;
  hasPrioritySupport: boolean;
  hasTeamManagement: boolean;
  features: string[];
  sortOrder: number;
}

export interface WorkspaceSubscription {
  id: string;
  plan: SubscriptionPlan;
  status: "active" | "trialing" | "past_due" | "canceled" | "expired";
  currentPeriodStart: string;
  currentPeriodEnd: string;
  trialEndsAt: string | null;
  createdAt: string;
}

export interface UsageData {
  aiGenerationsUsed: number;
  aiGenerationsLimit: number;
  apiCalls: number;
  storageUsed: number;
  usageByDay: Array<{
    date: string;
    generations: number;
    cost: string;
  }>;
}

export interface Invoice {
  id: string;
  amount: string;
  currency: string;
  status: "pending" | "paid" | "overdue" | "canceled";
  paidAt: string | null;
  dueDate: string;
  invoiceUrl: string | null;
  createdAt: string;
}

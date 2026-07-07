export interface AutopilotConfig {
  isEnabled: boolean;
  mode: "assist" | "auto" | "off";
  maxAutoRepliesPerHour: number;
  requireApprovalAbove: string | null;
  autoGreetNewFans: boolean;
  autoSellPpv: boolean;
  greetingMessage: string | null;
  totalAutoReplies: number;
  revenueGenerated: string;
}

export interface Flow {
  id: string;
  name: string;
  description: string | null;
  keyword: string | null;
  isActive: boolean;
  totalTriggered: number;
  totalConversions: number;
  steps: FlowStep[];
  createdAt: string;
}

export interface FlowStep {
  id: string;
  stepOrder: number;
  message: string;
  delayMinutes: number;
  condition: Record<string, unknown>;
  ppvCampaignId: string | null;
}

export interface KeywordTrigger {
  id: string;
  name: string;
  keywords: string[];
  response: string;
  matchType: "exact" | "contains" | "regex";
  isActive: boolean;
  totalMatches: number;
  totalConversions: number;
  revenue: string;
  createdAt: string;
}

export interface GuardWord {
  id: string;
  word: string;
  action: "block" | "flag" | "warn";
  isActive: boolean;
}

export interface BumpRule {
  id: string;
  name: string;
  inactiveDays: number;
  message: string;
  includePpv: boolean;
  isActive: boolean;
  totalSent: number;
  reEngaged: number;
  revenueRecovered: string;
  createdAt: string;
}

export interface BroadcastCampaign {
  id: string;
  name: string;
  message: string;
  status: "draft" | "scheduled" | "sending" | "sent" | "completed";
  totalTargeted: number;
  totalDelivered: number;
  totalOpens: number;
  totalConversions: number;
  revenue: string;
  scheduledFor: string | null;
  createdAt: string;
}

export interface SocialFunnel {
  id: string;
  name: string;
  platform: string;
  trigger: string;
  keywords: string[] | null;
  autoDmMessage: string;
  isActive: boolean;
  totalTriggered: number;
  totalConverted: number;
}

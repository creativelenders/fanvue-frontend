export interface TrackEventRequest {
  eventType: string;
  eventName?: string;
  pagePath?: string;
  referrer?: string;
  metadata?: Record<string, unknown>;
  value?: number;
}

export interface DashboardData {
  activeUsers: number;
  totalViews: number;
  totalGenerations: number;
  bounceRate: number;
  conversionRate: number;
  revenue: string;
  eventsOverTime: Array<{
    date: string;
    views: number;
    generations: number;
    conversions: number;
  }>;
  topStrategies: Array<{
    name: string;
    count: number;
    percentage: number;
  }>;
  engagementByPlatform: Array<{
    platform: string;
    count: number;
    avgEngagement: number;
  }>;
}

export interface DashboardParams {
  period: "24h" | "7d" | "30d" | "90d";
  platform?: string;
}

export interface TrafficSource {
  id: string;
  name: string;
  url: string | null;
  platform: string | null;
  trackingCode: string;
  totalClicks: number;
  totalSubscriptions: number;
  totalRevenue: string;
  roi: string;
  createdAt: string;
}

export interface CreateTrafficSourceRequest {
  name: string;
  url?: string;
  platform?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
}

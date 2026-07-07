import { useQuery } from "@tanstack/react-query";
import { Activity, DollarSign, Users, Bot, MessageSquare } from "lucide-react";
import { useState } from "react";
import { apiClient } from "../lib/api-client";
import { StatCard } from "../components/dashboard/stat-card";
import { ActivityFeed } from "../components/dashboard/activity-feed";
import { RevenueChart } from "../components/dashboard/revenue-chart";

// Mock data to use if backend fetch fails
const fallbackData = {
  metrics: [
    { label: "Total Revenue", value: "$12,450", change: "+14.5%", trend: "up" as const, icon: DollarSign },
    { label: "Active Fans", value: "3,412", change: "+5.2%", trend: "up" as const, icon: Users },
    { label: "AI Messages Sent", value: "45.2K", change: "+22.1%", trend: "up" as const, icon: Bot },
    { label: "PPV Conversion", value: "18.4%", change: "-2.3%", trend: "down" as const, icon: Activity },
  ],
  revenueChart: [
    { date: "Mon", value: 1200 },
    { date: "Tue", value: 1800 },
    { date: "Wed", value: 1500 },
    { date: "Thu", value: 2400 },
    { date: "Fri", value: 2100 },
    { date: "Sat", value: 3200 },
    { date: "Sun", value: 2800 },
  ],
  recentActivity: [
    { id: "1", type: "ppv_purchase", description: "Fan #4521 purchased PPV video", amount: "$25.00", time: "2 mins ago" },
    { id: "2", type: "new_subscriber", description: "New fan subscribed via TikTok funnel", amount: "$10.00", time: "15 mins ago" },
    { id: "3", type: "ai_chat", description: "Autopilot handled 45 messages while you were away", amount: null, time: "1 hour ago" },
    { id: "4", type: "bump_sent", description: "Bump campaign 'Weekend Special' completed", amount: null, time: "3 hours ago" },
  ]
};

export function DashboardView() {
  const [timeRange, setTimeRange] = useState("Last 7 days");

  const { data = fallbackData, isLoading } = useQuery({
    queryKey: ["dashboard-analytics", timeRange],
    queryFn: async () => {
      try {
        const response = await apiClient.api.get(`/analytics/dashboard?timeRange=${encodeURIComponent(timeRange)}`);
        const payload = response.data.data;
        // Attach icons to metrics since JSON doesn't support them natively
        const metricsWithIcons = payload.metrics.map((m: any, index: number) => ({
          ...m,
          icon: [DollarSign, Users, Bot, Activity][index] || Activity
        }));
        return {
          ...payload,
          metrics: metricsWithIcons,
        };
      } catch (e) {
        console.error("Dashboard fetch failed", e);
        return fallbackData; // Fallback to mock data if backend endpoint isn't ready
      }
    },
  });

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-text-main">Welcome back!</h1>
        <p className="text-text-muted mt-1">Here is what's happening with your account today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {data.metrics.map((metric: any, index: number) => (
          <StatCard
            key={index}
            label={metric.label}
            value={metric.value}
            change={metric.change}
            trend={metric.trend as any}
            icon={metric.icon}
          />
        ))}
      </div>

      {/* Main Charts & Activity Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[400px]">
        <div className="lg:col-span-2 h-full">
          <RevenueChart 
            data={data.revenueChart} 
            timeRange={timeRange}
            onTimeRangeChange={setTimeRange}
          />
        </div>
        <div className="h-full">
          <ActivityFeed activities={data.recentActivity} />
        </div>
      </div>
    </div>
  );
}

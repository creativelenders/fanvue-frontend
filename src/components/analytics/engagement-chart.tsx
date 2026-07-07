import { useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface ChartDataPoint {
  date: string;
  views: number;
  generations: number;
  conversions: number;
}

interface EngagementChartProps {
  data: ChartDataPoint[];
  isLoading?: boolean;
}

export function EngagementChart({ data, isLoading = false }: EngagementChartProps) {
  const formattedData = useMemo(
    () =>
      data.map((point) => ({
        ...point,
        date: new Date(point.date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
      })),
    [data]
  );

  if (isLoading) {
    return (
      <div className="h-80 rounded-lg bg-glass-base border border-glass-border animate-pulse flex items-center justify-center">
        <p className="text-text-muted text-sm">Loading chart...</p>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="h-80 rounded-lg bg-glass-base border border-glass-border flex items-center justify-center">
        <p className="text-text-muted text-sm">No data available for this period</p>
      </div>
    );
  }

  return (
    <div className="p-5 rounded-lg bg-glass-base border border-glass-border">
      <h3 className="text-sm font-medium text-text-main mb-4">Engagement Over Time</h3>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={formattedData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
            <defs>
              <linearGradient id="viewsGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#06B6D4" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="genGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
            <XAxis
              dataKey="date"
              tick={{ fill: "#94A3B8", fontSize: 11 }}
              axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "#94A3B8", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1E293B",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "8px",
                color: "#F8FAFC",
                fontSize: "12px",
              }}
            />
            <Legend
              wrapperStyle={{ fontSize: "12px", color: "#94A3B8" }}
            />
            <Area
              type="monotone"
              dataKey="views"
              stroke="#06B6D4"
              fill="url(#viewsGradient)"
              strokeWidth={2}
              name="Views"
            />
            <Area
              type="monotone"
              dataKey="generations"
              stroke="#8B5CF6"
              fill="url(#genGradient)"
              strokeWidth={2}
              name="Generations"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

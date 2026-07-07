import { useMemo } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

interface StrategyData {
  name: string;
  count: number;
  percentage: number;
}

interface StrategyBreakdownProps {
  data: StrategyData[];
  isLoading?: boolean;
}

const COLORS = ["#06B6D4", "#8B5CF6", "#EC4899", "#F59E0B", "#10B981", "#3B82F6"];

export function StrategyBreakdown({ data, isLoading = false }: StrategyBreakdownProps) {
  const chartData = useMemo(
    () =>
      data.map((item) => ({
        name: item.name,
        value: item.count,
      })),
    [data]
  );

  if (isLoading) {
    return (
      <div className="h-80 rounded-lg bg-glass-base border border-glass-border animate-pulse flex items-center justify-center">
        <p className="text-text-muted text-sm">Loading...</p>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="h-80 rounded-lg bg-glass-base border border-glass-border flex items-center justify-center">
        <p className="text-text-muted text-sm">No strategy data available</p>
      </div>
    );
  }

  return (
    <div className="p-5 rounded-lg bg-glass-base border border-glass-border">
      <h3 className="text-sm font-medium text-text-main mb-4">Strategy Performance</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={3}
              dataKey="value"
            >
              {chartData.map((_entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                  stroke="transparent"
                />
              ))}
            </Pie>
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
              wrapperStyle={{ fontSize: "11px", color: "#94A3B8" }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

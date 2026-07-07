import { type ReactNode } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string;
  trend?: number;
  icon: ReactNode;
  isLoading?: boolean;
}

export function MetricCard({ title, value, trend, icon, isLoading = false }: MetricCardProps) {
  if (isLoading) {
    return (
      <div className="p-5 rounded-lg bg-glass-base border border-glass-border animate-pulse">
        <div className="h-4 w-24 bg-glass-light rounded mb-3" />
        <div className="h-8 w-32 bg-glass-light rounded mb-2" />
        <div className="h-3 w-16 bg-glass-light rounded" />
      </div>
    );
  }

  return (
    <div className="p-5 rounded-lg bg-glass-base border border-glass-border hover:border-glass-border-hover 
                    transition-all duration-200 group">
      <div className="flex items-start justify-between mb-3">
        <p className="text-sm text-text-muted">{title}</p>
        <div className="p-2 rounded-md bg-glass-light group-hover:bg-glass-border transition-colors">
          {icon}
        </div>
      </div>
      <p className="text-2xl font-bold text-text-main">{value}</p>
      {trend !== undefined && (
        <div className="flex items-center gap-1 mt-1">
          {trend >= 0 ? (
            <TrendingUp className="w-3.5 h-3.5 text-status-success" />
          ) : (
            <TrendingDown className="w-3.5 h-3.5 text-status-danger" />
          )}
          <span
            className={`text-xs font-medium ${
              trend >= 0 ? "text-status-success" : "text-status-danger"
            }`}
          >
            {Math.abs(trend)}%
          </span>
          <span className="text-xs text-text-muted">vs last period</span>
        </div>
      )}
    </div>
  );
}

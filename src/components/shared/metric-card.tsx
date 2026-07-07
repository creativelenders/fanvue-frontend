import React from "react";

interface MetricCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export function MetricCard({ title, value, icon, trend }: MetricCardProps) {
  return (
    <div className="glass-card p-5 relative overflow-hidden group hover:border-glass-border-hover transition-colors">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-text-muted mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-text-main tracking-tight">{value}</h3>
          
          {trend && (
            <div className="mt-2 flex items-center text-xs">
              <span className={`font-medium ${trend.isPositive ? "text-status-success" : "text-status-danger"}`}>
                {trend.isPositive ? "+" : "-"}{Math.abs(trend.value)}%
              </span>
              <span className="text-text-muted ml-1.5">from last month</span>
            </div>
          )}
        </div>
        
        {icon && (
          <div className="p-2.5 rounded-lg bg-glass-light text-text-main group-hover:bg-primary-cyan/10 group-hover:text-primary-cyan transition-colors">
            {icon}
          </div>
        )}
      </div>
      
      {/* Subtle glow effect */}
      <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-primary-cyan/5 rounded-full blur-2xl group-hover:bg-primary-cyan/10 transition-colors" />
    </div>
  );
}

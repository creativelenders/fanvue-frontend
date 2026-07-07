import { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string;
  change: string;
  trend: "up" | "down";
  icon: LucideIcon;
}

export function StatCard({ label, value, change, trend, icon: Icon }: StatCardProps) {
  const isUp = trend === "up";

  return (
    <div className="bg-glass-base border border-glass-border rounded-xl p-5 shadow-depth flex flex-col hover:border-primary-cyan/30 transition-all duration-300">
      <div className="flex justify-between items-start mb-4">
        <div className="p-2.5 bg-glass-light rounded-lg text-primary-cyan">
          <Icon className="w-5 h-5" />
        </div>
        <span
          className={`flex items-center text-xs font-semibold px-2 py-1 rounded-full ${
            isUp
              ? "text-status-success bg-status-success/10"
              : "text-status-danger bg-status-danger/10"
          }`}
        >
          {change}
        </span>
      </div>
      <div>
        <h3 className="text-text-muted text-sm font-medium mb-1">{label}</h3>
        <p className="text-3xl font-bold text-text-main tracking-tight">{value}</p>
      </div>
    </div>
  );
}

import { usePermissions } from "../../hooks/use-permissions";
import { Lock } from "lucide-react";
import { Link } from "react-router-dom";


interface PlanGateProps {
  feature?: keyof typeof import("../../lib/permissions").PLAN_LIMITS.free;
  children: React.ReactNode;
  fallbackType?: "overlay" | "hide" | "alert";
  planName?: string;
}

export function PlanGate({ feature, children, fallbackType = "overlay", planName = "Elite" }: PlanGateProps) {
  const { planLimits, isAdmin } = usePermissions();

  let hasAccess = true;
  if (feature) {
    hasAccess = !!planLimits[feature];
  }

  if (hasAccess) {
    return <>{children}</>;
  }

  if (fallbackType === "hide") {
    return null;
  }

  if (fallbackType === "alert") {
    return (
      <div className="flex items-center gap-3 p-4 bg-glass-light border border-glass-border rounded-md">
        <div className="w-10 h-10 rounded-full bg-accent-gold/10 flex items-center justify-center text-accent-gold">
          <Lock className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-text-main">Premium Feature Locked</p>
          <p className="text-xs text-text-muted">Upgrade to the {planName} plan to access this feature.</p>
        </div>
        {isAdmin && (
          <Link to="/billing" className="btn-primary py-1.5 px-3 text-xs">
            Upgrade Now
          </Link>
        )}
      </div>
    );
  }

  // default: overlay
  return (
    <div className="relative group">
      <div className="blur-[4px] opacity-50 pointer-events-none select-none transition-all duration-300">
        {children}
      </div>
      <div className="absolute inset-0 z-10 flex items-center justify-center">
        <div className="glass-card p-6 flex flex-col items-center text-center max-w-sm border-accent-gold/30 shadow-2xl">
          <div className="w-12 h-12 rounded-full bg-accent-gold/10 flex items-center justify-center text-accent-gold mb-3">
            <Lock className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-text-main mb-1">Premium Feature</h3>
          <p className="text-sm text-text-muted mb-5">
            This feature requires the <strong className="text-accent-gold">{planName}</strong> plan. Upgrade your workspace to unlock advanced capabilities.
          </p>
          {isAdmin ? (
            <Link to="/billing" className="btn-primary w-full shadow-[0_0_15px_rgba(0,240,255,0.2)]">
              Upgrade to {planName}
            </Link>
          ) : (
            <p className="text-xs text-status-warning bg-status-warning/10 px-3 py-1.5 rounded-full border border-status-warning/20">
              Only workspace admins can upgrade plans.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

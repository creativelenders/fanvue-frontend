import { useWorkspace } from "../contexts/workspace-context";
import { usePermissions } from "../hooks/use-permissions";
import { useSocialFunnels, useCreateSocialFunnel } from "../hooks/use-automation";
import { PageHeader } from "../components/shared/page-header";
import { LoadingState } from "../components/shared/loading-state";
import { ErrorState } from "../components/shared/error-state";
import { EmptyState } from "../components/shared/empty-state";
import { StatusBadge } from "../components/shared/status-badge";
import { Share2, Plus, ArrowRight, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";

export function SocialFunnelsView() {
  const { currentWorkspace } = useWorkspace();
  const workspaceId = currentWorkspace?.id || "";
  const { planLimits, isAdmin } = usePermissions();

  const { data: funnels, isLoading, error, refetch } = useSocialFunnels(workspaceId);
  const createMutation = useCreateSocialFunnel();

  const currentCount = funnels?.length || 0;
  const isAtLimit = currentCount >= planLimits.socialPlatforms;

  return (
    <div>
      <PageHeader
        title="Social Funnels"
        description="Automate top-of-funnel conversion from social platforms like X or Instagram directly to FanVue."
        actions={
          <div className="flex items-center gap-3">
            {isAtLimit && (
              <span className="text-xs font-medium text-status-warning bg-status-warning/10 px-3 py-1.5 rounded-full border border-status-warning/20 flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5" />
                Limit Reached ({currentCount}/{planLimits.socialPlatforms})
              </span>
            )}
            <button 
              onClick={() => !isAtLimit && createMutation.mutate(workspaceId)}
              disabled={createMutation.isPending || isAtLimit}
              className={`flex items-center gap-1.5 ${isAtLimit ? 'px-4 py-2 bg-glass-border text-text-disabled rounded-md cursor-not-allowed font-medium text-sm' : 'btn-primary'}`}
            >
              <Plus className="w-4 h-4" />
              {createMutation.isPending ? "Connecting..." : "Connect Platform"}
            </button>
          </div>
        }
      />

      {isAtLimit && isAdmin && (
        <div className="mb-6 p-4 bg-accent-gold/10 border border-accent-gold/20 rounded-md flex items-center justify-between">
          <p className="text-sm text-text-main">
            You've reached your plan's limit of <strong className="text-accent-gold">{planLimits.socialPlatforms}</strong> social platforms.
          </p>
          <Link to="/billing" className="btn-primary py-1.5 px-3 text-xs shadow-[0_0_10px_rgba(0,240,255,0.2)]">
            Upgrade Plan
          </Link>
        </div>
      )}

      {isLoading ? (
        <LoadingState />
      ) : error ? (
        <ErrorState onRetry={() => refetch()} />
      ) : !funnels?.length ? (
        <EmptyState
          icon={<Share2 className="w-12 h-12" />}
          title="No social funnels"
          description="Connect an external social platform to auto-DM fans who interact with your content."
          action={
            isAtLimit 
              ? undefined 
              : { label: "Connect Platform", onClick: () => createMutation.mutate(workspaceId) }
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {funnels.map((funnel) => (
            <div key={funnel.id} className="glass-card-hover p-5">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary-blue/20 flex items-center justify-center text-primary-blue font-bold text-sm uppercase">
                    {funnel.platform.substring(0, 2)}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-text-main">{funnel.name}</h3>
                    <p className="text-xs text-text-muted capitalize">{funnel.platform} · {funnel.trigger}</p>
                  </div>
                </div>
                <StatusBadge status={funnel.isActive ? "active" : "paused"} />
              </div>
              
              <div className="flex items-center gap-2 mb-4 p-3 bg-glass-light rounded-md">
                <span className="text-sm font-medium text-text-main flex-1 truncate">
                  "{funnel.autoDmMessage}"
                </span>
              </div>

              <div className="flex items-center justify-between border-t border-glass-border pt-4">
                <div>
                  <p className="text-xs text-text-muted uppercase tracking-wider mb-1">Triggered</p>
                  <p className="text-xl font-bold text-text-main">{funnel.totalTriggered}</p>
                </div>
                <ArrowRight className="w-5 h-5 text-text-disabled" />
                <div className="text-right">
                  <p className="text-xs text-text-muted uppercase tracking-wider mb-1">Converted to Fan</p>
                  <p className="text-xl font-bold text-status-success">{funnel.totalConverted}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

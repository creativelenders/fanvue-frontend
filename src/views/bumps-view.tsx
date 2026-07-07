import { useWorkspace } from "../contexts/workspace-context";
import { useBumpRules, useCreateBumpRule } from "../hooks/use-automation";
import { PageHeader } from "../components/shared/page-header";
import { LoadingState } from "../components/shared/loading-state";
import { ErrorState } from "../components/shared/error-state";
import { EmptyState } from "../components/shared/empty-state";
import { StatusBadge } from "../components/shared/status-badge";
import { Bell, Plus, RefreshCw } from "lucide-react";

export function BumpsView() {
  const { currentWorkspace } = useWorkspace();
  const workspaceId = currentWorkspace?.id || "";

  const { data: bumps, isLoading, error, refetch } = useBumpRules(workspaceId);
  const createMutation = useCreateBumpRule();

  return (
    <div>
      <PageHeader
        title="Bumps (Re-engagement)"
        description="Automatically re-engage fans who haven't messaged in a while."
        actions={
          <button 
            onClick={() => createMutation.mutate(workspaceId)}
            className="btn-primary flex items-center gap-1.5"
            disabled={createMutation.isPending}
          >
            <Plus className="w-4 h-4" />
            {createMutation.isPending ? "Creating..." : "New Bump"}
          </button>
        }
      />

      {isLoading ? (
        <LoadingState />
      ) : error ? (
        <ErrorState onRetry={() => refetch()} />
      ) : !bumps?.length ? (
        <EmptyState
          icon={<Bell className="w-12 h-12" />}
          title="No bump rules"
          description="Create rules to automatically send messages to inactive fans."
          action={{ label: "New Bump", onClick: () => createMutation.mutate(workspaceId) }}
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {bumps.map((bump) => (
            <div key={bump.id} className="glass-card-hover p-5">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-lg font-semibold text-text-main">{bump.name}</h3>
                <StatusBadge status={bump.isActive ? "active" : "paused"} />
              </div>
              
              <div className="flex items-center gap-2 mb-4">
                <span className="px-2 py-0.5 rounded text-xs bg-secondary-violet/20 text-secondary-violet border border-secondary-violet/30">
                  After {bump.inactiveDays} days inactive
                </span>
                {bump.includePpv && (
                  <span className="px-2 py-0.5 rounded text-xs bg-accent-gold/20 text-accent-gold border border-accent-gold/30">
                    Includes PPV
                  </span>
                )}
              </div>

              <div className="bg-glass-light p-3 rounded-md border border-glass-border mb-4 text-sm text-text-muted italic">
                "{bump.message}"
              </div>

              <div className="flex justify-between items-center pt-3 border-t border-glass-border">
                <div className="flex items-center gap-4 text-sm">
                  <div>
                    <span className="text-text-muted mr-1">Sent:</span>
                    <span className="font-semibold text-text-main">{bump.totalSent}</span>
                  </div>
                  <div>
                    <span className="text-text-muted mr-1">Re-engaged:</span>
                    <span className="font-semibold text-status-success flex items-center gap-1">
                      <RefreshCw className="w-3 h-3" /> {bump.reEngaged}
                    </span>
                  </div>
                </div>
                <div className="font-mono text-status-success font-medium">
                  ${parseFloat(bump.revenueRecovered).toLocaleString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

import { useWorkspace } from "../contexts/workspace-context";
import { useBroadcasts, useCreateBroadcast } from "../hooks/use-automation";
import { PageHeader } from "../components/shared/page-header";
import { LoadingState } from "../components/shared/loading-state";
import { ErrorState } from "../components/shared/error-state";
import { EmptyState } from "../components/shared/empty-state";
import { StatusBadge } from "../components/shared/status-badge";
import { Megaphone, Plus, Calendar } from "lucide-react";

export function BroadcastsView() {
  const { currentWorkspace } = useWorkspace();
  const workspaceId = currentWorkspace?.id || "";

  const { data: broadcasts, isLoading, error, refetch } = useBroadcasts(workspaceId);
  const createMutation = useCreateBroadcast();

  return (
    <div>
      <PageHeader
        title="Mass Broadcasts"
        description="Schedule and send mass messages and PPV blasts to specific fan lists."
        actions={
          <button 
            onClick={() => createMutation.mutate(workspaceId)}
            className="btn-primary flex items-center gap-1.5"
            disabled={createMutation.isPending}
          >
            <Plus className="w-4 h-4" />
            {createMutation.isPending ? "Creating..." : "New Broadcast"}
          </button>
        }
      />

      {isLoading ? (
        <LoadingState />
      ) : error ? (
        <ErrorState onRetry={() => refetch()} />
      ) : !broadcasts?.length ? (
        <EmptyState
          icon={<Megaphone className="w-12 h-12" />}
          title="No broadcasts"
          description="Schedule your first mass message to boost PPV sales."
          action={{ label: "New Broadcast", onClick: () => createMutation.mutate(workspaceId) }}
        />
      ) : (
        <div className="glass-card overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-glass-border">
                <th className="text-left px-4 py-3 text-xs font-medium text-text-muted uppercase">Campaign</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-text-muted uppercase">Schedule</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-text-muted uppercase">Targeted</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-text-muted uppercase">Conversions</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-text-muted uppercase">Revenue</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-text-muted uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-glass-border">
              {broadcasts.map((b) => (
                <tr key={b.id} className="hover:bg-glass-light transition-colors">
                  <td className="px-4 py-3">
                    <p className="text-sm font-semibold text-text-main">{b.name}</p>
                    <p className="text-xs text-text-muted truncate max-w-[200px] mt-0.5">{b.message}</p>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5 text-sm text-text-muted">
                      <Calendar className="w-3.5 h-3.5" />
                      {b.scheduledFor ? new Date(b.scheduledFor).toLocaleString() : "Immediate"}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right text-sm font-medium text-text-main">
                    {b.totalTargeted.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <p className="text-sm font-medium text-text-main">{b.totalConversions}</p>
                    <p className="text-xs text-text-muted">
                      {b.totalDelivered > 0 ? Math.round((b.totalConversions / b.totalDelivered) * 100) : 0}% conv.
                    </p>
                  </td>
                  <td className="px-4 py-3 text-right text-sm font-mono text-status-success font-medium">
                    ${parseFloat(b.revenue).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <StatusBadge status={b.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

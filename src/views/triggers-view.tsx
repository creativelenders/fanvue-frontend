import { useWorkspace } from "../contexts/workspace-context";
import { useTriggers, useCreateTrigger } from "../hooks/use-automation";
import { PageHeader } from "../components/shared/page-header";
import { LoadingState } from "../components/shared/loading-state";
import { ErrorState } from "../components/shared/error-state";
import { EmptyState } from "../components/shared/empty-state";
import { StatusBadge } from "../components/shared/status-badge";
import { Key, Plus, MessageSquare } from "lucide-react";

export function TriggersView() {
  const { currentWorkspace } = useWorkspace();
  const workspaceId = currentWorkspace?.id || "";

  const { data: triggers, isLoading, error, refetch } = useTriggers(workspaceId);
  const createMutation = useCreateTrigger();

  return (
    <div>
      <PageHeader
        title="Keyword Triggers"
        description="Automatically reply to specific keywords or phrases in fan messages."
        actions={
          <button 
            onClick={() => createMutation.mutate(workspaceId)}
            className="btn-primary flex items-center gap-1.5"
            disabled={createMutation.isPending}
          >
            <Plus className="w-4 h-4" />
            {createMutation.isPending ? "Creating..." : "New Trigger"}
          </button>
        }
      />

      {isLoading ? (
        <LoadingState />
      ) : error ? (
        <ErrorState onRetry={() => refetch()} />
      ) : !triggers?.length ? (
        <EmptyState
          icon={<Key className="w-12 h-12" />}
          title="No keyword triggers"
          description="Create triggers to auto-reply when fans send specific words."
          action={{ label: "Create Trigger", onClick: () => createMutation.mutate(workspaceId) }}
        />
      ) : (
        <div className="glass-card overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-glass-border">
                <th className="text-left px-4 py-3 text-xs font-medium text-text-muted uppercase">Name & Keywords</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-text-muted uppercase">Match Type</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-text-muted uppercase">Response</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-text-muted uppercase">Conversions</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-text-muted uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-glass-border">
              {triggers.map((trigger) => (
                <tr key={trigger.id} className="hover:bg-glass-light transition-colors">
                  <td className="px-4 py-3">
                    <p className="text-sm font-semibold text-text-main">{trigger.name}</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {trigger.keywords.map((kw, i) => (
                        <span key={i} className="px-1.5 py-0.5 rounded text-[10px] bg-primary-cyan/10 text-primary-cyan border border-primary-cyan/20">
                          {kw}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-text-muted capitalize">{trigger.matchType}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 text-sm text-text-muted max-w-xs truncate">
                      <MessageSquare className="w-4 h-4 shrink-0" />
                      <span className="truncate">{trigger.response}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <p className="text-sm font-medium text-text-main">{trigger.totalConversions}</p>
                    <p className="text-xs text-status-success font-mono">${trigger.revenue}</p>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <StatusBadge status={trigger.isActive ? "active" : "paused"} />
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

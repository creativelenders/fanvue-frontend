import { useWorkspace } from "../contexts/workspace-context";
import { useGuardWords, useAddGuardWord } from "../hooks/use-automation";
import { PageHeader } from "../components/shared/page-header";
import { LoadingState } from "../components/shared/loading-state";
import { ErrorState } from "../components/shared/error-state";
import { EmptyState } from "../components/shared/empty-state";
import { StatusBadge } from "../components/shared/status-badge";
import { Shield, ShieldAlert, Plus } from "lucide-react";

export function MessageGuardView() {
  const { currentWorkspace } = useWorkspace();
  const workspaceId = currentWorkspace?.id || "";

  const { data: words, isLoading, error, refetch } = useGuardWords(workspaceId);
  const createMutation = useAddGuardWord();

  return (
    <div>
      <PageHeader
        title="Message Guard"
        description="Protect your account by automatically blocking or flagging specific words."
        actions={
          <button 
            onClick={() => createMutation.mutate(workspaceId)}
            className="btn-primary flex items-center gap-1.5"
            disabled={createMutation.isPending}
          >
            <Plus className="w-4 h-4" />
            {createMutation.isPending ? "Adding..." : "Add Word"}
          </button>
        }
      />

      {isLoading ? (
        <LoadingState />
      ) : error ? (
        <ErrorState onRetry={() => refetch()} />
      ) : !words?.length ? (
        <EmptyState
          icon={<Shield className="w-12 h-12" />}
          title="No guard words"
          description="Add words or phrases to automatically block or flag incoming messages."
          action={{ label: "Add Word", onClick: () => createMutation.mutate(workspaceId) }}
        />
      ) : (
        <div className="glass-card overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-glass-border">
                <th className="text-left px-4 py-3 text-xs font-medium text-text-muted uppercase">Word / Phrase</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-text-muted uppercase">Action</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-text-muted uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-glass-border">
              {words.map((w) => (
                <tr key={w.id} className="hover:bg-glass-light transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <ShieldAlert className="w-4 h-4 text-status-danger" />
                      <span className="text-sm font-semibold text-text-main">{w.word}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 text-xs rounded-md font-medium capitalize ${
                      w.action === 'block' ? 'bg-status-danger/20 text-status-danger' : 
                      'bg-status-warning/20 text-status-warning'
                    }`}>
                      {w.action}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <StatusBadge status={w.isActive ? "active" : "inactive"} />
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

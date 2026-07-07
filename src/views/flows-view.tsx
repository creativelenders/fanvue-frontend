import { useNavigate } from "react-router-dom";
import { useWorkspace } from "../contexts/workspace-context";
import { useFlows, useCreateFlow } from "../hooks/use-automation";
import { PageHeader } from "../components/shared/page-header";
import { LoadingState } from "../components/shared/loading-state";
import { ErrorState } from "../components/shared/error-state";
import { EmptyState } from "../components/shared/empty-state";
import { StatusBadge } from "../components/shared/status-badge";
import { GitBranch, Plus, ChevronRight } from "lucide-react";

export function FlowsView() {
  const { currentWorkspace } = useWorkspace();
  const workspaceId = currentWorkspace?.id || "";
  const navigate = useNavigate();

  const { data: flows, isLoading, error, refetch } = useFlows(workspaceId);
  const createMutation = useCreateFlow();

  if (!workspaceId) return <LoadingState />;

  return (
    <div>
      <PageHeader
        title="Conversation Flows"
        description="Design multi-step automated conversations and upsell funnels."
        actions={
          <button 
            onClick={() => createMutation.mutate(workspaceId)}
            className="btn-primary flex items-center gap-1.5"
            disabled={createMutation.isPending}
          >
            <Plus className="w-4 h-4" />
            {createMutation.isPending ? "Creating..." : "New Flow"}
          </button>
        }
      />

      {isLoading ? (
        <LoadingState />
      ) : error ? (
        <ErrorState onRetry={() => refetch()} />
      ) : !flows?.length ? (
        <EmptyState
          icon={<GitBranch className="w-12 h-12" />}
          title="No conversation flows"
          description="Build your first automated chat sequence to drive PPV sales."
          action={{ label: "Create Flow", onClick: () => createMutation.mutate(workspaceId) }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {flows.map((flow) => (
            <div key={flow.id} className="glass-card-hover p-5 flex flex-col h-full cursor-pointer">
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-lg bg-primary-cyan/10 flex items-center justify-center text-primary-cyan">
                  <GitBranch className="w-5 h-5" />
                </div>
                <StatusBadge status={flow.isActive ? "active" : "paused"} />
              </div>
              
              <h3 className="text-lg font-semibold text-text-main mb-1">{flow.name}</h3>
              <p className="text-sm text-text-muted flex-1 mb-6 line-clamp-2">
                {flow.description || "No description provided."}
              </p>
              
              <div className="flex items-center justify-between border-t border-glass-border pt-4 mt-auto">
                <div className="flex gap-4 text-sm">
                  <div>
                    <p className="text-text-muted text-xs">Triggered</p>
                    <p className="font-semibold text-text-main">{flow.totalTriggered}</p>
                  </div>
                  <div>
                    <p className="text-text-muted text-xs">Converted</p>
                    <p className="font-semibold text-status-success">{flow.totalConversions}</p>
                  </div>
                </div>
                
                <button 
                  onClick={() => navigate(`/flows/${flow.id}`)}
                  className="p-2 rounded-full hover:bg-glass-light transition-colors text-text-muted hover:text-text-main"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

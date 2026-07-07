import { useNavigate } from "react-router-dom";
import { useWorkspace } from "../contexts/workspace-context";
import { useOnboardingFunnels, useCreateOnboardingFunnel } from "../hooks/use-automation";
import { PageHeader } from "../components/shared/page-header";
import { LoadingState } from "../components/shared/loading-state";
import { ErrorState } from "../components/shared/error-state";
import { EmptyState } from "../components/shared/empty-state";
import { StatusBadge } from "../components/shared/status-badge";
import { UserPlus, Plus, ChevronRight, MessageSquare } from "lucide-react";

export function OnboardingFunnelsView() {
  const navigate = useNavigate();
  const { currentWorkspace } = useWorkspace();
  const workspaceId = currentWorkspace?.id || "";

  const { data: funnels, isLoading, error, refetch } = useOnboardingFunnels(workspaceId);
  const createMutation = useCreateOnboardingFunnel();

  return (
    <div>
      <PageHeader
        title="Onboarding Funnels"
        description="Design the experience a fan sees immediately after subscribing."
        actions={
          <button 
            onClick={() => createMutation.mutate(workspaceId)}
            disabled={createMutation.isPending}
            className="btn-primary flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            {createMutation.isPending ? "Creating..." : "Create Flow"}
          </button>
        }
      />

      {isLoading ? (
        <LoadingState />
      ) : error ? (
        <ErrorState onRetry={() => refetch()} />
      ) : !funnels?.length ? (
        <EmptyState
          icon={<UserPlus className="w-12 h-12" />}
          title="No onboarding flows"
          description="Welcome new subscribers with an automated message, voice note, or introductory PPV offer."
          action={{ label: "Create Flow", onClick: () => createMutation.mutate(workspaceId) }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {funnels.map((funnel) => (
            <div key={funnel.id} className="glass-card-hover p-5 flex flex-col h-full cursor-pointer">
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-lg bg-primary-cyan/10 flex items-center justify-center text-primary-cyan">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <StatusBadge status={funnel.isActive ? "active" : "paused"} />
              </div>
              
              <h3 className="text-lg font-semibold text-text-main mb-1">{funnel.name}</h3>
              <p className="text-sm text-text-muted flex-1 mb-6 line-clamp-2">
                {funnel.description || "No description provided."}
              </p>
              
              <div className="flex items-center justify-between border-t border-glass-border pt-4 mt-auto">
                <div className="flex gap-4 text-sm">
                  <div>
                    <p className="text-text-muted text-xs uppercase">Triggered</p>
                    <p className="font-semibold text-text-main">{funnel.totalTriggered || 0}</p>
                  </div>
                  <div>
                    <p className="text-text-muted text-xs uppercase">Converted</p>
                    <p className="font-semibold text-status-success">{funnel.totalConversions || 0}</p>
                  </div>
                </div>
                
                <button 
                  onClick={() => navigate(`/onboarding/${funnel.id}`)}
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

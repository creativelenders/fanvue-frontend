import { useNavigate } from "react-router-dom";
import { useWorkspace } from "../contexts/workspace-context";
import { useFanLists, useCreateFanList } from "../hooks/use-fans";
import { PageHeader } from "../components/shared/page-header";
import { LoadingState } from "../components/shared/loading-state";
import { ErrorState } from "../components/shared/error-state";
import { EmptyState } from "../components/shared/empty-state";
import { List, Plus, Users } from "lucide-react";

export function FanListsView() {
  const { currentWorkspace } = useWorkspace();
  const workspaceId = currentWorkspace?.id || "";
  const navigate = useNavigate();

  const { data: lists, isLoading, error, refetch } = useFanLists(workspaceId);
  const createList = useCreateFanList();

  return (
    <div>
      <PageHeader
        title="Fan Lists"
        description="Organize fans into dynamic segments for targeted mass messaging and PPV campaigns."
        actions={
          <button 
            onClick={() => createList.mutate({ workspaceId, data: { name: "New List", isDynamic: true }})}
            className="btn-primary flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            Create List
          </button>
        }
      />

      {isLoading ? (
        <LoadingState />
      ) : error ? (
        <ErrorState onRetry={() => refetch()} />
      ) : !lists?.length ? (
        <EmptyState
          icon={<List className="w-12 h-12" />}
          title="No fan lists"
          description="Create a dynamic segment (e.g. 'Whales', 'At Risk') to better target your audience."
          action={{ label: "Create List", onClick: () => createList.mutate({ workspaceId, data: { name: "New List", isDynamic: true }}) }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {lists.map((list) => (
            <div key={list.id} className="glass-card-hover p-5">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-text-main flex items-center gap-2">
                  <List className="w-4 h-4 text-primary-cyan" />
                  {list.name}
                </h3>
                {list.isDynamic && (
                  <span className="px-2 py-0.5 rounded text-[10px] bg-secondary-violet/20 text-secondary-violet border border-secondary-violet/30 uppercase tracking-wider">
                    Dynamic
                  </span>
                )}
              </div>
              <p className="text-sm text-text-muted mb-6">
                {list.description || "No rules defined."}
              </p>
              
              <div className="flex items-center justify-between pt-4 border-t border-glass-border">
                <div className="flex items-center gap-2 text-text-main font-medium">
                  <Users className="w-4 h-4 text-text-muted" />
                  {list.totalFans}
                </div>
                <button 
                  onClick={() => navigate(`/fans?listId=${list.id}`)}
                  className="text-xs font-medium text-primary-cyan hover:text-primary-blue transition-colors"
                >
                  View Fans
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

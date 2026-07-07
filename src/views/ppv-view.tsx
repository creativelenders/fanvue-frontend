import { useWorkspace } from "../contexts/workspace-context";
import { usePpv, useAddPpv } from "../hooks/use-ppv";
import { PageHeader } from "../components/shared/page-header";
import { LoadingState } from "../components/shared/loading-state";
import { ErrorState } from "../components/shared/error-state";
import { EmptyState } from "../components/shared/empty-state";
import { DollarSign, Plus, Image as ImageIcon, Video } from "lucide-react";

export function PpvView() {
  const { currentWorkspace } = useWorkspace();
  const workspaceId = currentWorkspace?.id || "";

  const { data: ppvItems, isLoading, error, refetch } = usePpv(workspaceId);
  const addPpv = useAddPpv();

  return (
    <div>
      <PageHeader
        title="PPV Manager"
        description="Manage your Pay-Per-View content, track sales, and optimize pricing."
        actions={
          <button 
            onClick={() => addPpv.mutate({ workspaceId, data: {} })}
            disabled={addPpv.isPending}
            className="btn-primary flex items-center gap-1.5 disabled:opacity-50"
          >
            <Plus className="w-4 h-4" />
            {addPpv.isPending ? "Uploading..." : "Upload PPV"}
          </button>
        }
      />

      {isLoading ? (
        <LoadingState />
      ) : error ? (
        <ErrorState onRetry={() => refetch()} />
      ) : !ppvItems?.length ? (
        <EmptyState
          icon={<DollarSign className="w-12 h-12" />}
          title="No PPV content"
          description="Upload exclusive content to sell directly to fans."
          action={{ label: "Upload PPV", onClick: () => addPpv.mutate({ workspaceId, data: {} }) }}
        />
      ) : (
        <div className="glass-card overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-glass-border">
                <th className="text-left px-4 py-3 text-xs font-medium text-text-muted uppercase">Content</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-text-muted uppercase">Price</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-text-muted uppercase">Sent</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-text-muted uppercase">Purchases</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-text-muted uppercase">Revenue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-glass-border">
              {ppvItems.map((item) => (
                <tr key={item.id} className="hover:bg-glass-light transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded bg-glass-border flex items-center justify-center text-text-muted">
                        {item.mediaType === "video" ? <Video className="w-5 h-5" /> : <ImageIcon className="w-5 h-5" />}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-text-main">{item.name}</p>
                        <p className="text-xs text-text-muted">{new Date(item.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-text-main">${item.price}</td>
                  <td className="px-4 py-3 text-right text-sm text-text-muted">{item.totalSent}</td>
                  <td className="px-4 py-3 text-right">
                    <p className="text-sm font-medium text-text-main">{item.totalPurchased}</p>
                    <p className="text-xs text-text-muted">
                      {item.totalSent > 0 ? Math.round((item.totalPurchased / item.totalSent) * 100) : 0}% conv.
                    </p>
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-status-success font-bold">
                    ${parseFloat(item.revenue).toLocaleString()}
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

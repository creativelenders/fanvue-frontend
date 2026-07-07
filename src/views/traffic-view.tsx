import { useWorkspace } from "../contexts/workspace-context";
import { toast } from "sonner";
import { useTrafficLinks, useCreateTrafficLink } from "../hooks/use-traffic";
import { PageHeader } from "../components/shared/page-header";
import { LoadingState } from "../components/shared/loading-state";
import { ErrorState } from "../components/shared/error-state";
import { EmptyState } from "../components/shared/empty-state";
import { PlanGate } from "../components/shared/plan-gate";
import { BarChart3, Plus, Link as LinkIcon, Copy } from "lucide-react";

export function TrafficView() {
  const { currentWorkspace } = useWorkspace();
  const workspaceId = currentWorkspace?.id || "";

  const { data: links, isLoading, error, refetch } = useTrafficLinks(workspaceId);
  const createMutation = useCreateTrafficLink();

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(`https://fanvue.com/t/${code}`);
    toast.success("Tracking link copied to clipboard!");
  };

  return (
    <div>
      <PageHeader
        title="Traffic Analytics"
        description="Track inbound link clicks, conversions, and ROI by social source."
        actions={
          <button 
            onClick={() => createMutation.mutate(workspaceId)}
            disabled={createMutation.isPending}
            className="btn-primary flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            {createMutation.isPending ? "Creating..." : "New Tracking Link"}
          </button>
        }
      />

      <PlanGate feature="hasAdvancedAnalytics" planName="Elite">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="glass-card p-5">
            <p className="text-sm text-text-muted mb-1">Total Clicks</p>
            <p className="text-3xl font-bold text-text-main">0</p>
          </div>
          <div className="glass-card p-5">
            <p className="text-sm text-text-muted mb-1">New Subscribers</p>
            <p className="text-3xl font-bold text-text-main">0</p>
          </div>
          <div className="glass-card p-5">
            <p className="text-sm text-text-muted mb-1">Attributed Revenue</p>
            <p className="text-3xl font-bold text-status-success font-mono">$0.00</p>
          </div>
        </div>
      </PlanGate>

      {isLoading ? (
        <LoadingState />
      ) : error ? (
        <ErrorState onRetry={() => refetch()} />
      ) : !links?.length ? (
        <EmptyState
          icon={<BarChart3 className="w-12 h-12" />}
          title="No traffic data"
          description="Generate tracking links for your social bios to see where your best fans come from."
          action={{ label: "Create Link", onClick: () => createMutation.mutate(workspaceId) }}
        />
      ) : (
        <div className="bg-glass-card border border-glass-border rounded-lg overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-glass-base/50 text-xs uppercase text-text-muted">
              <tr>
                <th className="px-4 py-3 font-medium">Link Name & Source</th>
                <th className="px-4 py-3 font-medium">Tracking Code</th>
                <th className="px-4 py-3 font-medium text-right">Clicks</th>
                <th className="px-4 py-3 font-medium text-right">Conversions</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-glass-border">
              {links.map((link) => (
                <tr key={link.id} className="hover:bg-glass-light transition-colors">
                  <td className="px-4 py-3">
                    <p className="text-sm font-medium text-text-main">{link.name}</p>
                    <p className="text-xs text-text-muted capitalize">{link.platform} · {link.campaign}</p>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 px-2 py-1 bg-glass-base border border-glass-border rounded w-max">
                      <LinkIcon className="w-3 h-3 text-primary-cyan" />
                      <span className="text-xs font-mono text-text-main">{link.trackingCode}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right text-sm font-medium text-text-main">
                    {link.totalClicks || 0}
                  </td>
                  <td className="px-4 py-3 text-right text-sm font-medium text-status-success">
                    {link.totalConversions || 0}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button 
                      onClick={() => handleCopy(link.trackingCode)}
                      className="p-1.5 rounded-md text-text-muted hover:text-text-main hover:bg-glass-light transition-colors"
                      title="Copy Link"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
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

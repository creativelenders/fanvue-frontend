import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useWorkspace } from "../contexts/workspace-context";
import { useFans, useAddFan, useRescoreAllFans, useDeleteFan } from "../hooks/use-fans";
import { PageHeader } from "../components/shared/page-header";
import { LoadingState } from "../components/shared/loading-state";
import { ErrorState } from "../components/shared/error-state";
import { EmptyState } from "../components/shared/empty-state";
import { StatusBadge } from "../components/shared/status-badge";
import { MetricCard } from "../components/shared/metric-card";
import {
  Users,
  UserPlus,
  Activity,
  TrendingDown,
  RefreshCw,
  Search,
  Eye,
  Trash2,
} from "lucide-react";
import type { FanStatus, FanListQuery } from "../types/fans";

export function FansView() {
  const { currentWorkspace } = useWorkspace();
  const workspaceId = currentWorkspace?.id || "";
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<FanStatus | "">("");
  const [sort, setSort] = useState<"score" | "totalSpend" | "lastActiveAt" | "createdAt">("score");
  const [page, setPage] = useState(1);

  const query: FanListQuery = {
    page,
    limit: 20,
    sort,
    order: "desc",
    search: search || undefined,
    status: statusFilter || undefined,
  };

  const { data, isLoading, error, refetch } = useFans(workspaceId, query);
  const addFan = useAddFan();
  const rescoreAll = useRescoreAllFans();
  const deleteFan = useDeleteFan();

  // Compute summary metrics from data
  const totalFans = data?.meta.total || 0;
  const activeFans = data?.data.filter((f) => f.status === "active").length || 0;
  const churnedFans = data?.data.filter((f) => f.status === "churned").length || 0;
  const avgScore = data?.data.length
    ? Math.round(data.data.reduce((sum, f) => sum + f.score, 0) / data.data.length)
    : 0;

  if (!workspaceId) return <LoadingState />;

  return (
    <div>
      <PageHeader
        title="Fans CRM"
        description="Track, score, and segment fans to maximize lifetime value"
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={() => rescoreAll.mutate(workspaceId)}
              disabled={rescoreAll.isPending}
              className="btn-ghost flex items-center gap-1.5"
            >
              <RefreshCw className={`w-4 h-4 ${rescoreAll.isPending ? "animate-spin" : ""}`} />
              Rescore All
            </button>
            <button
              onClick={() => addFan.mutate({ workspaceId, data: {} })}
              className="btn-primary flex items-center gap-1.5"
            >
              <UserPlus className="w-4 h-4" />
              Add Fan
            </button>
          </div>
        }
      />

      {/* Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <MetricCard title="Total Fans" value={totalFans.toLocaleString()} icon={<Users className="w-4 h-4 text-primary-cyan" />} />
        <MetricCard title="Active Subscribers" value={activeFans.toLocaleString()} icon={<Activity className="w-4 h-4 text-status-success" />} />
        <MetricCard title="Churned" value={churnedFans.toLocaleString()} icon={<TrendingDown className="w-4 h-4 text-status-danger" />} />
        <MetricCard title="Avg Score" value={avgScore.toString()} icon={<Users className="w-4 h-4 text-secondary-violet" />} />
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search by name or handle..."
            className="w-full pl-9 pr-3 py-2 text-sm bg-glass-base border border-glass-border rounded-md 
                       text-text-main placeholder:text-text-disabled focus:outline-none focus:ring-2 focus:ring-primary-cyan/50"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value as FanStatus | ""); setPage(1); }}
          className="px-3 py-2 text-sm bg-glass-base border border-glass-border rounded-md text-text-main focus:outline-none focus:ring-2 focus:ring-primary-cyan/50"
        >
          <option value="">All statuses</option>
          <option value="active">Active</option>
          <option value="expired">Expired</option>
          <option value="churned">Churned</option>
          <option value="pending">Pending</option>
        </select>
        <select
          value={sort}
          onChange={(e) => { setSort(e.target.value as any); setPage(1); }}
          className="px-3 py-2 text-sm bg-glass-base border border-glass-border rounded-md text-text-main focus:outline-none focus:ring-2 focus:ring-primary-cyan/50"
        >
          <option value="score">Sort by Score</option>
          <option value="totalSpend">Sort by Spend</option>
          <option value="lastActiveAt">Sort by Activity</option>
          <option value="createdAt">Sort by Date Added</option>
        </select>
      </div>

      {/* Fan Table */}
      {isLoading ? (
        <LoadingState />
      ) : error ? (
        <ErrorState message="Failed to load fans" onRetry={() => refetch()} />
      ) : !data?.data.length ? (
        <EmptyState
          icon={<Users className="w-12 h-12" />}
          title="No fans yet"
          description="Add fans manually or import them to start scoring and segmenting."
          action={{ label: "Add Fan", onClick: () => addFan.mutate({ workspaceId, data: {} }) }}
        />
      ) : (
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-glass-border">
                  <th className="text-left px-4 py-3 text-xs font-medium text-text-muted uppercase tracking-wider">Name</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-text-muted uppercase tracking-wider">Handle</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-text-muted uppercase tracking-wider">Status</th>
                  <th className="text-center px-4 py-3 text-xs font-medium text-text-muted uppercase tracking-wider">Score</th>
                  <th className="text-right px-4 py-3 text-xs font-medium text-text-muted uppercase tracking-wider">Total Spend</th>
                  <th className="text-right px-4 py-3 text-xs font-medium text-text-muted uppercase tracking-wider">Messages</th>
                  <th className="text-right px-4 py-3 text-xs font-medium text-text-muted uppercase tracking-wider">Last Active</th>
                  <th className="text-right px-4 py-3 text-xs font-medium text-text-muted uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-glass-border">
                {data.data.map((fan) => (
                  <tr key={fan.id} className="hover:bg-glass-light transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary-cyan/20 flex items-center justify-center text-xs text-primary-cyan font-medium">
                          {fan.name?.charAt(0).toUpperCase() || "?"}
                        </div>
                        <span className="text-sm text-text-main font-medium">{fan.name || "Unknown"}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-text-muted">{fan.handle || "—"}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={fan.status} />
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold ${
                        fan.score >= 70 ? "bg-status-success/20 text-status-success" :
                        fan.score >= 40 ? "bg-status-warning/20 text-status-warning" :
                        "bg-status-danger/20 text-status-danger"
                      }`}>
                        {fan.score}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right text-sm text-text-main font-mono">
                      ${parseFloat(fan.totalSpend).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-right text-sm text-text-muted">{fan.totalMessages}</td>
                    <td className="px-4 py-3 text-right text-sm text-text-muted">
                      {fan.lastActiveAt
                        ? new Date(fan.lastActiveAt).toLocaleDateString()
                        : "Never"}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => navigate(`/fans/${fan.id}`)}
                          className="px-3 py-1.5 text-xs font-medium bg-glass-light hover:bg-glass-base border border-glass-border rounded-md text-text-main transition-colors"
                        >
                          View
                        </button>
                        <button
                          onClick={() => deleteFan.mutate({ workspaceId, fanId: fan.id })}
                          className="p-1.5 rounded-md text-text-muted hover:text-status-danger hover:bg-status-danger/10 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {data && data.meta.totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-glass-border">
              <p className="text-sm text-text-muted">
                Page {data.meta.page} of {data.meta.totalPages} ({data.meta.total} total)
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={!data.meta.hasPrev}
                  className="px-3 py-1.5 text-sm bg-glass-base border border-glass-border rounded-md text-text-muted hover:text-text-main disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => setPage((p) => p + 1)}
                  disabled={!data.meta.hasNext}
                  className="px-3 py-1.5 text-sm bg-glass-base border border-glass-border rounded-md text-text-muted hover:text-text-main disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

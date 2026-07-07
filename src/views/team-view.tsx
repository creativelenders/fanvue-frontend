import { useState } from "react";
import { useWorkspace } from "../contexts/workspace-context";
import { useShifts, useStartShift, useEndShift, useLeaderboard } from "../hooks/use-team";
import { PageHeader } from "../components/shared/page-header";
import { LoadingState } from "../components/shared/loading-state";
import { ErrorState } from "../components/shared/error-state";
import { EmptyState } from "../components/shared/empty-state";
import { Clock, Play, Square, Trophy, DollarSign, MessageSquare, Send, Zap } from "lucide-react";

export function TeamView() {
  const { currentWorkspace } = useWorkspace();
  const workspaceId = currentWorkspace?.id || "";

  const [activeTab, setActiveTab] = useState<"leaderboard" | "shifts">("leaderboard");

  const { data: shifts, isLoading: shiftsLoading, error: shiftsError, refetch: refetchShifts } = useShifts(workspaceId);
  const { data: leaderboard, isLoading: leaderboardLoading } = useLeaderboard(workspaceId);
  const startShift = useStartShift();
  const endShift = useEndShift();

  const activeShift = shifts?.find((s) => !s.endedAt);

  return (
    <div>
      <PageHeader
        title="Chatter Shifts"
        description="Track team performance and manage shifts"
        actions={
          activeShift ? (
            <button
              onClick={() => endShift.mutate({ workspaceId, shiftId: activeShift.id })}
              className="btn-primary flex items-center gap-1.5 bg-status-danger hover:bg-status-danger/90"
            >
              <Square className="w-4 h-4" />
              End Shift
            </button>
          ) : (
            <button
              onClick={() => startShift.mutate(workspaceId)}
              disabled={startShift.isPending}
              className="btn-primary flex items-center gap-1.5"
            >
              <Play className="w-4 h-4" />
              Start Shift
            </button>
          )
        }
      />

      {/* Active Shift Banner */}
      {activeShift && (
        <div className="mb-6 p-4 rounded-lg bg-status-success/10 border border-status-success/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-status-success/20 flex items-center justify-center">
              <Zap className="w-5 h-5 text-status-success animate-pulse" />
            </div>
            <div>
              <p className="text-sm font-medium text-text-main">
                Active shift — {activeShift.chatterName}
              </p>
              <p className="text-xs text-text-muted">
                Started {new Date(activeShift.startedAt).toLocaleTimeString()} · 
                {activeShift.totalMessages} messages · {activeShift.totalPpvSent} PPV sent
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 mb-6 p-1 rounded-lg bg-glass-base border border-glass-border w-fit">
        {["leaderboard", "shifts"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as typeof activeTab)}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-all capitalize ${
              activeTab === tab
                ? "bg-primary-cyan/20 text-primary-cyan"
                : "text-text-muted hover:text-text-main"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Leaderboard Tab */}
      {activeTab === "leaderboard" && (
        leaderboardLoading ? (
          <LoadingState />
        ) : !leaderboard?.length ? (
          <EmptyState icon={<Trophy className="w-12 h-12" />} title="No data yet" description="Start shifts to see team performance." />
        ) : (
          <div className="glass-card overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-glass-border">
                  <th className="text-left px-4 py-3 text-xs font-medium text-text-muted uppercase">#</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-text-muted uppercase">Chatter</th>
                  <th className="text-right px-4 py-3 text-xs font-medium text-text-muted uppercase">Revenue</th>
                  <th className="text-right px-4 py-3 text-xs font-medium text-text-muted uppercase">Messages</th>
                  <th className="text-right px-4 py-3 text-xs font-medium text-text-muted uppercase">PPV Sent</th>
                  <th className="text-right px-4 py-3 text-xs font-medium text-text-muted uppercase">Conv. Rate</th>
                  <th className="text-right px-4 py-3 text-xs font-medium text-text-muted uppercase">Avg Resp.</th>
                  <th className="text-right px-4 py-3 text-xs font-medium text-text-muted uppercase">Shifts</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-glass-border">
                {leaderboard.map((entry, idx) => (
                  <tr key={entry.chatterId} className="hover:bg-glass-light transition-colors">
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
                        idx === 0 ? "bg-accent-gold/20 text-accent-gold" :
                        idx === 1 ? "bg-glass-border text-text-muted" :
                        idx === 2 ? "bg-status-warning/20 text-status-warning" :
                        "text-text-disabled"
                      }`}>
                        {idx + 1}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary-cyan/20 flex items-center justify-center text-xs text-primary-cyan font-medium">
                          {entry.chatterName.charAt(0)}
                        </div>
                        <span className="text-sm text-text-main">{entry.chatterName}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right text-sm text-text-main font-mono">${parseFloat(entry.revenue).toLocaleString()}</td>
                    <td className="px-4 py-3 text-right text-sm text-text-muted">{entry.messages}</td>
                    <td className="px-4 py-3 text-right text-sm text-text-muted">{entry.ppvSent}</td>
                    <td className="px-4 py-3 text-right text-sm text-text-muted">{entry.conversionRate}%</td>
                    <td className="px-4 py-3 text-right text-sm text-text-muted">{entry.avgResponseTime}s</td>
                    <td className="px-4 py-3 text-right text-sm text-text-muted">{entry.shifts}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      )}

      {/* Shifts Tab */}
      {activeTab === "shifts" && (
        shiftsLoading ? (
          <LoadingState />
        ) : shiftsError ? (
          <ErrorState onRetry={() => refetchShifts()} />
        ) : !shifts?.length ? (
          <EmptyState icon={<Clock className="w-12 h-12" />} title="No shifts recorded" description="Start your first shift to begin tracking." />
        ) : (
          <div className="space-y-3">
            {shifts.map((shift) => (
              <div key={shift.id} className="glass-card p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-text-main">{shift.chatterName}</p>
                  <p className="text-xs text-text-muted">
                    {new Date(shift.startedAt).toLocaleString()}
                    {shift.endedAt && ` → ${new Date(shift.endedAt).toLocaleTimeString()}`}
                  </p>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-text-muted">{shift.totalMessages} msgs</span>
                  <span className="text-text-muted">{shift.totalPpvSent} PPV</span>
                  <span className="font-mono text-status-success">${parseFloat(shift.revenue).toLocaleString()}</span>
                  {!shift.endedAt && (
                    <span className="px-2 py-0.5 text-xs rounded-full bg-status-success/20 text-status-success animate-pulse">
                      Live
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
}

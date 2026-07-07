import { useWorkspace } from "../contexts/workspace-context";
import { useSchedules, useCreateSchedule } from "../hooks/use-team";
import { PageHeader } from "../components/shared/page-header";
import { LoadingState } from "../components/shared/loading-state";
import { ErrorState } from "../components/shared/error-state";
import { EmptyState } from "../components/shared/empty-state";
import { Calendar, Plus } from "lucide-react";

export function ScheduleView() {
  const { currentWorkspace } = useWorkspace();
  const workspaceId = currentWorkspace?.id || "";

  const { data: schedules, isLoading, error, refetch } = useSchedules(workspaceId);
  const createSchedule = useCreateSchedule();

  const handleAddShift = () => {
    // Generate a simple mock schedule for demonstration
    const days = [0, 1, 2, 3, 4, 5, 6]; // 0 is Sunday
    const dayOfWeek = days[Math.floor(Math.random() * days.length)];
    
    createSchedule.mutate({
      workspaceId,
      data: {
        dayOfWeek,
        startTime: "09:00",
        endTime: "17:00",
      }
    });
  };

  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  return (
    <div>
      <PageHeader
        title="Shift Schedules"
        description="Plan when your live agents are online to handle traffic peaks."
        actions={
          <button 
            onClick={handleAddShift}
            disabled={createSchedule.isPending}
            className="btn-primary flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            {createSchedule.isPending ? "Adding..." : "Add Shift"}
          </button>
        }
      />

      {isLoading ? (
        <LoadingState />
      ) : error ? (
        <ErrorState onRetry={() => refetch()} />
      ) : !schedules?.length ? (
        <EmptyState
          icon={<Calendar className="w-12 h-12" />}
          title="No upcoming shifts"
          description="Schedule your team to ensure 24/7 fan engagement coverage."
          action={{ label: "Add Shift", onClick: handleAddShift }}
        />
      ) : (
        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold text-text-main mb-4">Upcoming Schedule</h2>
          <div className="space-y-2">
            {schedules.map((schedule) => (
              <div key={schedule.id} className="flex items-center justify-between p-4 bg-glass-light border border-glass-border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary-cyan/20 flex items-center justify-center text-primary-cyan font-bold">
                    {(schedule as any).user?.name?.charAt(0) || "U"}
                  </div>
                  <div>
                    <p className="font-medium text-text-main">{(schedule as any).user?.name || "Unknown Agent"}</p>
                    <p className="text-sm text-text-muted">
                      {dayNames[schedule.dayOfWeek]} · {schedule.startTime} to {schedule.endTime}
                    </p>
                  </div>
                </div>
                <div className="text-sm text-text-muted">
                  Recurring
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

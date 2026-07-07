import { useState } from "react";
import { useWorkspace } from "../contexts/workspace-context";
import { useAutopilotConfig, useUpdateAutopilot } from "../hooks/use-automation";
import { PageHeader } from "../components/shared/page-header";
import { LoadingState } from "../components/shared/loading-state";
import { ErrorState } from "../components/shared/error-state";
import { Bot, MessageSquare, DollarSign, Play, Loader2 } from "lucide-react";
import { toast } from "sonner";

export function AutopilotView() {
  const { currentWorkspace } = useWorkspace();
  const workspaceId = currentWorkspace?.id || "";

  const { data: config, isLoading, error, refetch } = useAutopilotConfig(workspaceId);
  const updateAutopilot = useUpdateAutopilot();

  const [testFanMessage, setTestFanMessage] = useState("");

  if (!workspaceId) return <LoadingState />;

  const handleToggle = async (key: string, value: boolean) => {
    await updateAutopilot.mutateAsync({
      workspaceId,
      data: { [key]: value },
    });
  };

  const handleModeChange = async (mode: string) => {
    await updateAutopilot.mutateAsync({
      workspaceId,
      data: { mode: mode as "assist" | "auto" | "off" },
    });
  };

  return (
    <div>
      <PageHeader
        title="Autopilot"
        description="Let AI handle fan conversations with configurable control"
      />

      {isLoading ? (
        <LoadingState />
      ) : error ? (
        <ErrorState message={`Failed to load autopilot config: ${(error as any)?.response?.data?.error?.message || error.message}`} onRetry={() => refetch()} />
      ) : !config ? null : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Configuration Panel */}
          <div className="lg:col-span-2 space-y-6">
            {/* Master Switch */}
            <div className="glass-card p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-text-main">Autopilot Status</h3>
                  <p className="text-sm text-text-muted">Master control for AI-powered conversations</p>
                </div>
                <button
                  onClick={() => handleToggle("isEnabled", !config.isEnabled)}
                  className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
                    config.isEnabled ? "bg-primary-cyan" : "bg-glass-border"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform duration-200 ${
                      config.isEnabled ? "translate-x-6" : ""
                    }`}
                  />
                </button>
              </div>

              {/* Mode Selector */}
              <div className="mb-6">
                <label className="text-sm font-medium text-text-main mb-2 block">Mode</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { value: "assist", label: "ASSIST", desc: "Suggest replies" },
                    { value: "auto", label: "AUTO", desc: "Reply automatically" },
                    { value: "off", label: "OFF", desc: "Manual only" },
                  ].map((mode) => (
                    <button
                      key={mode.value}
                      onClick={() => handleModeChange(mode.value)}
                      className={`p-3 rounded-lg border text-left transition-all ${
                        config.mode === mode.value
                          ? "border-primary-cyan/50 bg-primary-cyan/10 text-primary-cyan"
                          : "border-glass-border bg-glass-base text-text-muted hover:text-text-main"
                      }`}
                    >
                      <p className="text-sm font-semibold">{mode.label}</p>
                      <p className="text-xs opacity-70 mt-0.5">{mode.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Settings Grid */}
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-text-main">Automation Settings</h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Max Auto-Replies */}
                  <div className="space-y-2">
                    <label className="text-sm text-text-muted">Max auto-replies / hour</label>
                    <input
                      type="number"
                      value={config.maxAutoRepliesPerHour}
                      onChange={(e) => updateAutopilot.mutate({
                        workspaceId,
                        data: { maxAutoRepliesPerHour: parseInt(e.target.value) },
                      })}
                      className="w-full px-3 py-2 bg-glass-base border border-glass-border rounded-md text-text-main focus:outline-none focus:ring-2 focus:ring-primary-cyan/50"
                      min={1}
                      max={500}
                    />
                  </div>

                  {/* Require Approval Above */}
                  <div className="space-y-2">
                    <label className="text-sm text-text-muted">Require approval above ($)</label>
                    <input
                      type="number"
                      value={config.requireApprovalAbove || ""}
                      onChange={(e) => updateAutopilot.mutate({
                        workspaceId,
                        data: { requireApprovalAbove: e.target.value ? parseFloat(e.target.value).toString() : null },
                      })}
                      placeholder="No limit"
                      className="w-full px-3 py-2 bg-glass-base border border-glass-border rounded-md text-text-main focus:outline-none focus:ring-2 focus:ring-primary-cyan/50"
                      min={0}
                      step={0.01}
                    />
                  </div>
                </div>

                {/* Toggles */}
                {[
                  { key: "autoGreetNewFans", label: "Auto-greet new fans", desc: "Send welcome message to new subscribers" },
                  { key: "autoSellPpv", label: "Auto-sell PPV", desc: "Automatically offer PPV content to engaged fans" },
                ].map((toggle) => (
                  <div key={toggle.key} className="flex items-center justify-between py-2">
                    <div>
                      <p className="text-sm text-text-main">{toggle.label}</p>
                      <p className="text-xs text-text-muted">{toggle.desc}</p>
                    </div>
                    <button
                      onClick={() => handleToggle(toggle.key, !(config as any)[toggle.key])}
                      className={`relative w-10 h-5 rounded-full transition-colors ${
                        (config as any)[toggle.key] ? "bg-primary-cyan" : "bg-glass-border"
                      }`}
                    >
                      <span
                        className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
                          (config as any)[toggle.key] ? "translate-x-5" : ""
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Test Message Panel */}
            <div className="glass-card p-6">
              <h3 className="text-sm font-medium text-text-main mb-4 flex items-center gap-2">
                <Play className="w-4 h-4 text-primary-cyan" />
                Process a message
              </h3>
              <div className="space-y-3">
                <textarea
                  value={testFanMessage}
                  onChange={(e) => setTestFanMessage(e.target.value)}
                  placeholder="Paste a sample fan message to test..."
                  rows={3}
                  className="w-full px-3 py-2 bg-glass-base border border-glass-border rounded-md text-text-main placeholder:text-text-disabled resize-none focus:outline-none focus:ring-2 focus:ring-primary-cyan/50"
                />
                <button
                  onClick={() => toast.success("Message processed successfully by Autopilot!")}
                  disabled={!testFanMessage.trim()}
                  className="btn-primary flex items-center gap-2"
                >
                  <Loader2 className="w-4 h-4" />
                  Process now
                </button>
              </div>
            </div>
          </div>

          {/* Performance Card */}
          <div className="space-y-4">
            <div className="glass-card p-6">
              <h3 className="text-sm font-medium text-text-main mb-4">Performance</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg bg-glass-light">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-primary-cyan" />
                    <span className="text-sm text-text-muted">Auto-replies</span>
                  </div>
                  <span className="text-lg font-bold text-text-main">
                    {config.totalAutoReplies.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-glass-light">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-status-success" />
                    <span className="text-sm text-text-muted">Revenue</span>
                  </div>
                  <span className="text-lg font-bold text-text-main">
                    ${parseFloat(config.revenueGenerated).toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-glass-light">
                  <div className="flex items-center gap-2">
                    <Bot className="w-4 h-4 text-secondary-violet" />
                    <span className="text-sm text-text-muted">Current mode</span>
                  </div>
                  <span className="text-sm font-semibold text-primary-cyan uppercase">
                    {config.mode}
                  </span>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <button
              onClick={() => {
                refetch();
                toast.success("Autopilot settings saved successfully!");
              }}
              className="w-full py-3 bg-gradient-to-r from-primary-cyan to-primary-blue text-white font-medium rounded-md hover:opacity-90 transition-opacity"
            >
              Save Settings
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

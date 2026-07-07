import { useState } from "react";
import { useWorkspace } from "../../contexts/workspace-context";
import { useCreateWorkspace } from "../../hooks/use-workspace";
import { ChevronDown, Plus, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { usePermissions } from "../../hooks/use-permissions";
import { toast } from "sonner";

export function WorkspaceSwitcher() {
  const { currentWorkspace, workspaces, switchWorkspace } = useWorkspace();
  const { effectivePlan, planLimits } = usePermissions();
  const createMutation = useCreateWorkspace();
  const [open, setOpen] = useState(false);
  const [isCreatingWorkspace, setIsCreatingWorkspace] = useState(false);
  const [newWorkspaceName, setNewWorkspaceName] = useState("");
  const navigate = useNavigate();

  const handleCreateWorkspace = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!newWorkspaceName.trim()) return;
    
    const slug = newWorkspaceName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "") + "-" + Date.now();
    createMutation.mutate(
      { name: newWorkspaceName.trim(), slug },
      {
        onSuccess: (newWs) => {
          setOpen(false);
          setIsCreatingWorkspace(false);
          setNewWorkspaceName("");
          switchWorkspace(newWs);
          toast.success("Workspace created successfully");
        },
        onError: (err: any) => {
          toast.error(`Failed to create workspace: ${err?.response?.data?.error?.message || err.message}`);
          console.error("Workspace creation failed:", err);
        }
      }
    );
  };

  if (!currentWorkspace) return null;

  return (
    <div className="relative p-3 border-b border-glass-border">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 w-full px-3 py-2 rounded-md bg-glass-light hover:bg-glass-border transition-all duration-200"
      >
        <div className="w-6 h-6 rounded bg-primary-cyan/20 flex items-center justify-center text-xs text-primary-cyan font-bold">
          {currentWorkspace.name.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1 text-left min-w-0">
          <p className="text-sm font-medium text-text-main truncate">
            {currentWorkspace.name}
          </p>
          <p className="text-[10px] text-text-muted capitalize">
            {effectivePlan.replace("_", " ")} · {currentWorkspace.aiGenerationsUsed} / {planLimits.aiGenerations} gen
          </p>
        </div>
        <ChevronDown className="w-4 h-4 text-text-muted" />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute top-full left-3 right-3 mt-1 z-20 bg-glass-base border border-glass-border rounded-lg shadow-depth py-1">
            {workspaces.map((ws) => (
              <button
                key={ws.id}
                onClick={() => {
                  switchWorkspace(ws);
                  setOpen(false);
                  setIsCreatingWorkspace(false);
                }}
                className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-glass-light transition-colors"
              >
                <div className="w-5 h-5 rounded bg-primary-cyan/20 flex items-center justify-center text-[10px] text-primary-cyan font-bold">
                  {ws.name.charAt(0).toUpperCase()}
                </div>
                <span className="flex-1 text-left text-text-main truncate">
                  {ws.name}
                </span>
                {ws.id === currentWorkspace.id && (
                  <Check className="w-3.5 h-3.5 text-primary-cyan" />
                )}
              </button>
            ))}
            <div className="border-t border-glass-border mt-1 pt-1">
              {workspaces.length >= planLimits.seats ? (
                <button
                  disabled
                  className="flex items-center gap-2 w-full px-3 py-2 text-sm text-status-warning bg-status-warning/10 cursor-not-allowed"
                >
                  Limit Reached ({workspaces.length}/{planLimits.seats} Workspaces)
                </button>
              ) : isCreatingWorkspace ? (
                <form onSubmit={handleCreateWorkspace} className="p-2 animate-in fade-in slide-in-from-top-1">
                  <input
                    type="text"
                    value={newWorkspaceName}
                    onChange={(e) => setNewWorkspaceName(e.target.value)}
                    placeholder="Workspace Name"
                    className="w-full px-2 py-1.5 bg-bg-main border border-primary-cyan/50 rounded text-sm text-white placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-primary-cyan mb-2"
                    autoFocus
                  />
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => setIsCreatingWorkspace(false)}
                      className="flex-1 px-2 py-1 text-xs text-text-muted hover:bg-glass-light rounded transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      onClick={handleCreateWorkspace}
                      disabled={!newWorkspaceName.trim() || createMutation.isPending}
                      className="flex-1 px-2 py-1 text-xs bg-primary-cyan text-white rounded hover:bg-primary-hover disabled:opacity-50 transition-colors"
                    >
                      {createMutation.isPending ? "..." : "Save"}
                    </button>
                  </div>
                </form>
              ) : (
                <button
                  onClick={() => setIsCreatingWorkspace(true)}
                  className="flex items-center gap-2 w-full px-3 py-2 text-sm text-text-muted hover:text-text-main hover:bg-glass-light transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  New Workspace
                </button>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

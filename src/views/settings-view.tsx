import { useState, useRef } from "react";
import { useWorkspace } from "../contexts/workspace-context";
import { PageHeader } from "../components/shared/page-header";
import { Settings, Save, Trash2, X, AlertTriangle } from "lucide-react";
import { LoadingState } from "../components/shared/loading-state";
import { PlanGate } from "../components/shared/plan-gate";
import { useUpdateWorkspace, useDeleteWorkspace } from "../hooks/use-workspace";
import { useNavigate } from "react-router-dom";

export function SettingsView() {
  const { currentWorkspace } = useWorkspace();
  const updateWorkspace = useUpdateWorkspace();
  const deleteWorkspace = useDeleteWorkspace();
  const navigate = useNavigate();

  const [name, setName] = useState(currentWorkspace?.name || "");
  const [fanvueConnected, setFanvueConnected] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");

  if (!currentWorkspace) return <LoadingState message="Loading settings..." />;

  const handleSave = () => {
    if (!name.trim()) return;
    updateWorkspace.mutate({
      workspaceId: currentWorkspace.id,
      data: { name: name.trim() }
    });
  };

  const handleDelete = () => {
    if (deleteConfirmText !== currentWorkspace.name) return;
    deleteWorkspace.mutate(currentWorkspace.id, {
      onSuccess: () => {
        setShowDeleteModal(false);
        // Will be redirected by workspace context/auth automatically, or force to /
        navigate("/");
      }
    });
  };

  return (
    <div className="max-w-4xl relative">
      <PageHeader
        title="Workspace Settings"
        description="Manage your platform integrations, team roles, and billing."
      />

      <div className="space-y-6">
        {/* General Settings */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-text-main mb-4 border-b border-glass-border pb-2">General</h3>
          <div className="space-y-4 max-w-md">
            <div>
              <label className="text-sm text-text-muted block mb-1.5">Workspace Name</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 bg-glass-light border border-glass-border rounded-md text-text-main focus:outline-none focus:border-primary-cyan transition-colors"
              />
            </div>
            <div>
              <label className="text-sm text-text-muted block mb-1.5">FanVue URL</label>
              <input 
                type="text" 
                placeholder="https://fanvue.com/your-handle"
                className="w-full px-3 py-2 bg-glass-light border border-glass-border rounded-md text-text-main focus:outline-none focus:border-primary-cyan transition-colors"
              />
            </div>
            <button 
              onClick={handleSave}
              disabled={updateWorkspace.isPending || !name.trim() || name === currentWorkspace.name}
              className="btn-primary flex items-center gap-1.5 mt-2"
            >
              <Save className="w-4 h-4" />
              {updateWorkspace.isPending ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>

        {/* API Integrations */}
        <PlanGate feature="hasApiAccess" planName="Agency">
          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold text-text-main mb-4 border-b border-glass-border pb-2">API Integrations</h3>
            <div className="flex items-center justify-between p-4 bg-glass-light rounded-md border border-glass-border transition-colors">
              <div>
                <p className="font-medium text-text-main">FanVue Connection</p>
                <p className="text-sm text-text-muted">
                  Status: <span className={fanvueConnected ? "text-status-success" : "text-status-warning"}>
                    {fanvueConnected ? "Connected" : "Disconnected"}
                  </span>
                </p>
              </div>
              <button 
                onClick={() => setFanvueConnected(!fanvueConnected)}
                className={fanvueConnected ? "px-4 py-2 bg-glass-border text-text-main text-sm font-medium rounded-md hover:bg-glass-border/80" : "btn-primary"}
              >
                {fanvueConnected ? "Disconnect" : "Connect Account"}
              </button>
            </div>
          </div>
        </PlanGate>

        {/* Danger Zone */}
        <div className="glass-card p-6 border-status-danger/30 relative overflow-hidden group">
          <div className="absolute inset-0 bg-status-danger/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
          <h3 className="text-lg font-semibold text-status-danger mb-4 border-b border-status-danger/20 pb-2">Danger Zone</h3>
          <p className="text-sm text-text-muted mb-4">
            Deleting your workspace will permanently remove all fan data, content, and automations. This action cannot be undone.
          </p>
          <button 
            onClick={() => setShowDeleteModal(true)}
            className="px-4 py-2 bg-status-danger/10 hover:bg-status-danger/20 text-status-danger border border-status-danger/50 rounded-md transition-colors flex items-center gap-1.5"
          >
            <Trash2 className="w-4 h-4" />
            Delete Workspace
          </button>
        </div>
      </div>

      {/* Beautiful Deletion Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-[#0b0c10]/80 backdrop-blur-sm"
            onClick={() => setShowDeleteModal(false)}
          />
          
          <div className="glass-card relative w-full max-w-md p-6 animate-in fade-in zoom-in-95 duration-200 border-status-danger/50 shadow-2xl shadow-status-danger/20">
            <button 
              onClick={() => setShowDeleteModal(false)}
              className="absolute top-4 right-4 text-text-muted hover:text-text-main transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4 text-status-danger">
              <div className="w-10 h-10 rounded-full bg-status-danger/10 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold">Delete Workspace?</h2>
            </div>
            
            <p className="text-text-muted mb-6 text-sm leading-relaxed">
              You are about to permanently delete <strong className="text-text-main">{currentWorkspace.name}</strong>. 
              This will immediately wipe all CRM data, active funnels, and historical analytics. 
              <span className="block mt-2 text-status-danger">This action is irreversible.</span>
            </p>

            <div className="mb-6">
              <label className="text-xs text-text-muted font-medium mb-1.5 block uppercase tracking-wider">
                Type <strong className="text-text-main select-none">{currentWorkspace.name}</strong> to confirm
              </label>
              <input 
                type="text" 
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                placeholder={currentWorkspace.name}
                className="w-full px-3 py-2 bg-[#0b0c10] border border-status-danger/30 rounded-md text-text-main placeholder-text-disabled focus:outline-none focus:border-status-danger focus:ring-1 focus:ring-status-danger/50 transition-all"
              />
            </div>

            <div className="flex items-center justify-end gap-3">
              <button 
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-sm font-medium text-text-muted hover:text-text-main transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleDelete}
                disabled={deleteConfirmText !== currentWorkspace.name || deleteWorkspace.isPending}
                className="px-4 py-2 text-sm font-medium bg-status-danger hover:bg-status-danger/90 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(239,68,68,0.3)] hover:shadow-[0_0_20px_rgba(239,68,68,0.5)]"
              >
                {deleteWorkspace.isPending ? "Deleting..." : "Permanently Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

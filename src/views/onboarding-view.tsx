import { useState } from "react";
import { useCreateWorkspace } from "../hooks/use-workspace";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

export function OnboardingView() {
  const [name, setName] = useState("");
  const createWorkspace = useCreateWorkspace();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    
    try {
      const workspace = await createWorkspace.mutateAsync({
        name,
        slug: name.toLowerCase().replace(/[^a-z0-9]/g, "-") + "-" + Date.now(),
      });
      // Force reload or let context pick it up
      navigate("/");
    } catch (error) {
      console.error("Failed to create workspace:", error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-bg-main p-4">
      <div className="glass-card max-w-md w-full p-8 space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-text-main">Create Your Workspace</h1>
          <p className="text-text-muted mt-2">Get started by setting up your first workspace.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-muted mb-1">
              Workspace Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Creator Empire"
              className="w-full px-4 py-2 bg-bg-sidebar border border-border-main rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-main/50"
              required
            />
          </div>

          <button
            type="submit"
            disabled={createWorkspace.isPending || !name.trim()}
            className="w-full flex items-center justify-center gap-2 bg-primary-main text-white py-2 rounded-xl hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {createWorkspace.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : "Create Workspace"}
          </button>
        </form>
      </div>
    </div>
  );
}

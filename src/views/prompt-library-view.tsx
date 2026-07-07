import { PageHeader } from "../components/shared/page-header";
import { EmptyState } from "../components/shared/empty-state";
import { Search, Plus, Trash } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { usePrompts, useCreatePrompt, useDeletePrompt } from "../hooks/use-prompts";

export function PromptLibraryView() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [newName, setNewName] = useState("");
  const [newContent, setNewContent] = useState("");

  const { data: prompts = [], isLoading } = usePrompts();
  const createPrompt = useCreatePrompt();
  const deletePrompt = useDeletePrompt();

  const filteredPrompts = prompts.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreatePrompt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newContent.trim()) return;
    
    createPrompt.mutate(
      { name: newName, content: newContent, category: "chat" },
      { onSuccess: () => {
        toast.success("Prompt created successfully!");
        setIsCreating(false);
        setNewName("");
        setNewContent("");
      }}
    );
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500">
      <PageHeader
        title="Prompt Library"
        description="Manage and organize your custom AI prompts."
        actions={
          <button 
            onClick={() => setIsCreating(!isCreating)}
            disabled={createPrompt.isPending}
            className="btn-primary flex items-center gap-1.5 disabled:opacity-50"
          >
            <Plus className="w-4 h-4" />
            {isCreating ? "Cancel" : "New Prompt"}
          </button>
        }
      />

      {isCreating && (
        <form onSubmit={handleCreatePrompt} className="mb-6 p-4 glass-card border border-primary-cyan/30 space-y-4 animate-in fade-in slide-in-from-top-4">
          <h3 className="font-semibold text-text-main">Create New Prompt</h3>
          <div>
            <label className="block text-sm text-text-muted mb-1">Name</label>
            <input 
              type="text" 
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="e.g., Casual Greeting" 
              className="w-full px-3 py-2 bg-glass-light border border-glass-border rounded-md text-sm text-text-main focus:outline-none focus:border-primary-cyan"
              autoFocus
              required
            />
          </div>
          <div>
            <label className="block text-sm text-text-muted mb-1">Prompt Content</label>
            <textarea 
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              placeholder="e.g., Hey babes! Thanks for subscribing..." 
              rows={3}
              className="w-full px-3 py-2 bg-glass-light border border-glass-border rounded-md text-sm text-text-main focus:outline-none focus:border-primary-cyan resize-none"
              required
            />
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setIsCreating(false)} className="px-4 py-2 text-sm text-text-muted hover:text-text-main">Cancel</button>
            <button type="submit" disabled={createPrompt.isPending || !newName.trim() || !newContent.trim()} className="btn-primary text-sm px-6">
              {createPrompt.isPending ? "Creating..." : "Save Prompt"}
            </button>
          </div>
        </form>
      )}

      <div className="mb-6 relative w-full max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
        <input 
          type="text" 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search prompts..." 
          className="w-full pl-9 pr-3 py-2 bg-glass-light border border-glass-border rounded-md text-sm text-text-main focus:outline-none focus:ring-1 focus:ring-primary-cyan"
        />
      </div>

      <div className="flex-1 glass-card overflow-y-auto">
        {isLoading ? (
          <div className="p-8 text-center text-text-muted">Loading prompts...</div>
        ) : filteredPrompts.length === 0 ? (
          <EmptyState
            title="No prompts found"
            description="Create your first reusable prompt to speed up workflow."
            action={{ label: "Create Prompt", onClick: () => setIsCreating(true) }}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
            {filteredPrompts.map(p => (
              <div key={p.id} className="bg-glass-light border border-glass-border p-4 rounded-md flex flex-col justify-between">
                <div>
                  <h3 className="text-md font-bold text-text-main">{p.name}</h3>
                  <p className="text-sm text-text-muted mt-2 whitespace-pre-wrap">{p.content}</p>
                </div>
                <div className="mt-4 pt-4 border-t border-glass-border flex justify-end gap-2">
                  {confirmDeleteId === p.id ? (
                    <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right-2">
                      <span className="text-xs text-text-muted">Sure?</span>
                      <button 
                        className="text-xs text-status-danger hover:underline font-bold" 
                        onClick={() => {
                          deletePrompt.mutate(p.id, { onSuccess: () => {
                            toast.success("Prompt deleted!");
                            setConfirmDeleteId(null);
                          }});
                        }}
                      >
                        Yes
                      </button>
                      <button 
                        className="text-xs text-text-muted hover:text-text-main" 
                        onClick={() => setConfirmDeleteId(null)}
                      >
                        No
                      </button>
                    </div>
                  ) : (
                    <button 
                      className="text-xs text-status-danger hover:underline flex items-center gap-1" 
                      onClick={() => setConfirmDeleteId(p.id)}
                    >
                      <Trash className="w-3 h-3" /> Delete
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

import { useWorkspace } from "../contexts/workspace-context";
import { PageHeader } from "../components/shared/page-header";
import { EmptyState } from "../components/shared/empty-state";
import { BrainCircuit, Sparkles, Wand2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useGenerations, usePersonas, useTrainPersona, useGenerateContent } from "../hooks/use-content";

export function ContentBrainView() {
  const { currentWorkspace } = useWorkspace();
  const workspaceId = currentWorkspace?.id || "";
  const [prompt, setPrompt] = useState("");

  const { data: generations = [] } = useGenerations();
  const { data: personas = [] } = usePersonas();
  
  const generateMutation = useGenerateContent();
  const trainMutation = useTrainPersona();

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <PageHeader
        title="Content Brain"
        description="Generate AI-driven captions, scripts, and content ideas trained on your unique voice."
        actions={
          <button 
            onClick={() => setPrompt("")}
            className="btn-primary flex items-center gap-1.5 bg-gradient-to-r from-secondary-violet to-primary-blue hover:opacity-90 transition-opacity border-none"
          >
            <Sparkles className="w-4 h-4" />
            New Generation
          </button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 glass-card p-6">
          <h3 className="text-lg font-semibold text-text-main mb-4 flex items-center gap-2">
            <BrainCircuit className="w-5 h-5 text-primary-cyan" />
            Prompt Engine
          </h3>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-text-muted mb-2 block">What do you want to create?</label>
              <textarea 
                rows={4}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g. Write a flirty caption for my new gym selfie promoting my 50% off PPV bundle..."
                className="w-full px-4 py-3 bg-glass-light border border-glass-border rounded-md text-text-main focus:outline-none focus:border-primary-cyan/50 resize-none"
              ></textarea>
            </div>
            <div className="flex justify-end">
              <button 
                onClick={() => {
                  if (!prompt.trim()) { toast.error("Please enter a prompt"); return; }
                  generateMutation.mutate(
                    { prompt, type: "caption" },
                    {
                      onSuccess: () => {
                        toast.success("Content generated and saved successfully!");
                        setPrompt("");
                      }
                    }
                  );
                }}
                disabled={generateMutation.isPending}
                className="btn-primary flex items-center gap-1.5 disabled:opacity-50"
              >
                <Wand2 className="w-4 h-4" />
                {generateMutation.isPending ? "Generating..." : "Generate Options"}
              </button>
            </div>
          </div>
        </div>

        <div className="glass-card p-6 flex flex-col">
          <h3 className="text-lg font-semibold text-text-main mb-4">Saved Personas</h3>
          <div className="flex-1 overflow-y-auto min-h-[200px]">
            {personas.length === 0 ? (
              <EmptyState
                title="No personas trained"
                description="Train the AI on your past posts to match your exact writing style."
                action={{ 
                  label: trainMutation.isPending ? "Training..." : "Train Persona", 
                  onClick: () => {
                    trainMutation.mutate({ description: "Train based on recent posts" }, {
                      onSuccess: () => toast.success("Persona trained successfully!")
                    });
                  } 
                }}
              />
            ) : (
              <div className="space-y-3">
                {personas.map((persona: any) => (
                  <div key={persona.id} className="p-3 bg-glass-light border border-glass-border rounded-md">
                    <h4 className="text-sm font-semibold text-text-main">{persona.name}</h4>
                    <p className="text-xs text-text-muted mt-1 truncate">{persona.description}</p>
                  </div>
                ))}
                <button 
                  onClick={() => {
                    trainMutation.mutate({ description: "Train new persona" }, {
                      onSuccess: () => toast.success("Persona trained successfully!")
                    });
                  }}
                  disabled={trainMutation.isPending}
                  className="w-full mt-2 py-2 text-sm text-primary-cyan hover:bg-primary-cyan/10 rounded-md transition-colors border border-dashed border-primary-cyan/30 disabled:opacity-50"
                >
                  {trainMutation.isPending ? "Training..." : "+ Train Another Persona"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <h3 className="text-lg font-semibold text-text-main mb-4">Recent Generations</h3>
      {generations.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {generations.map((gen: any) => (
            <div key={gen.id} className="glass-card p-6 bg-glass-light border border-glass-border rounded-md flex flex-col justify-between">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-primary-cyan font-semibold mb-2 block">{gen.platform}</span>
                <p className="text-text-main text-sm">{gen.generatedContent}</p>
              </div>
              <div className="mt-4 pt-4 border-t border-glass-border">
                <p className="text-[10px] text-text-muted italic truncate">Prompt: {gen.prompt}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="glass-card p-12 text-center text-text-muted">
          No recent content generated.
        </div>
      )}
    </div>
  );
}

import { useState } from "react";
import { useGenerateContent, useContentStrategies } from "../../hooks/use-content";
import { useModels } from "../../hooks/use-models";
import { StrategySelector } from "./strategy-selector";
import { Loader2, Sparkles, Send } from "lucide-react";
import type { GenerateContentResponse } from "../../types/content";

interface ContentGeneratorProps {
  onGenerated?: (result: GenerateContentResponse) => void;
}

export function ContentGenerator({ onGenerated }: ContentGeneratorProps) {
  const [prompt, setPrompt] = useState("");
  const [strategySlug, setStrategySlug] = useState("viral_amplified");
  const [aiModelSlug, setAiModelSlug] = useState("");
  const [variations, setVariations] = useState(1);

  const generate = useGenerateContent();
  const { data: strategies, isLoading: strategiesLoading } = useContentStrategies();
  const { data: models } = useModels();

  const handleSubmit = async () => {
    if (!prompt.trim()) return;

    const result = await generate.mutateAsync({
      prompt: prompt.trim(),
      strategySlug,
      aiModelSlug: aiModelSlug || undefined,
      variations,
    });

    onGenerated?.(result);
  };

  const activeModels = models?.filter((m) => m.isActive) ?? [];

  return (
    <div className="space-y-6">
      {/* Strategy Selection */}
      <StrategySelector
        strategies={strategies ?? []}
        selected={strategySlug}
        onSelect={setStrategySlug}
        isLoading={strategiesLoading}
      />

      {/* Prompt Input */}
      <div className="space-y-2">
        <label htmlFor="prompt" className="text-sm font-medium text-text-main">
          Content Prompt
        </label>
        <textarea
          id="prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe the content you want to create... e.g., 'A motivational video about overcoming creative blocks'"
          rows={4}
          className="w-full px-3 py-2.5 bg-glass-base border border-glass-border rounded-md 
                     text-text-main placeholder:text-text-disabled resize-none
                     focus:outline-none focus:ring-2 focus:ring-primary-cyan/50 focus:border-primary-cyan
                     transition-all duration-200"
        />
        <p className="text-xs text-text-muted text-right">
          {prompt.length} / 5000 characters
        </p>
      </div>

      {/* Options Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* AI Model */}
        <div className="space-y-2">
          <label htmlFor="model" className="text-sm font-medium text-text-main">
            AI Model
          </label>
          <select
            id="model"
            value={aiModelSlug}
            onChange={(e) => setAiModelSlug(e.target.value)}
            className="w-full px-3 py-2.5 bg-glass-base border border-glass-border rounded-md 
                       text-text-main focus:outline-none focus:ring-2 focus:ring-primary-cyan/50
                       transition-all duration-200"
          >
            <option value="">Auto-select (Hybrid Router)</option>
            {activeModels.map((model) => (
              <option key={model.id} value={model.slug}>
                {model.name} ({model.provider}) — ${model.costPerRequest}/req
              </option>
            ))}
          </select>
        </div>

        {/* Variations */}
        <div className="space-y-2">
          <label htmlFor="variations" className="text-sm font-medium text-text-main">
            Variations
          </label>
          <div className="flex items-center gap-2">
            {[1, 3, 5, 10].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setVariations(n)}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  variations === n
                    ? "bg-primary-cyan text-white shadow-glow"
                    : "bg-glass-base text-text-muted hover:text-text-main border border-glass-border"
                }`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Generate Button */}
      <button
        onClick={handleSubmit}
        disabled={!prompt.trim() || generate.isPending}
        className="w-full py-3 bg-gradient-to-r from-primary-cyan to-primary-blue hover:from-primary-cyan/90 
                   hover:to-primary-blue/90 text-white font-medium rounded-md transition-all duration-200 
                   disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-glow"
      >
        {generate.isPending ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Generating with {generate.variables?.aiModelSlug || "Hybrid Router"}...
          </>
        ) : (
          <>
            <Sparkles className="w-5 h-5" />
            Generate Content
          </>
        )}
      </button>

      {/* Result */}
      {generate.data && (
        <div className="p-4 rounded-lg bg-glass-base border border-glass-border animate-slide-in">
          <div className="flex items-start justify-between mb-3">
            <div>
              <span className="text-xs text-primary-cyan bg-primary-cyan/10 px-2 py-0.5 rounded-full font-medium">
                {generate.data.aiModel.name}
              </span>
              <span className="text-xs text-text-muted ml-2">
                ${generate.data.costIncurred} · {generate.data.tokensUsed} tokens ·{" "}
                {generate.data.latencyMs}ms
              </span>
            </div>
            <button
              onClick={() => navigator.clipboard.writeText(generate.data!.generatedContent)}
              className="text-xs text-text-muted hover:text-text-main transition-colors"
            >
              Copy
            </button>
          </div>
          <pre className="text-sm text-text-main whitespace-pre-wrap font-sans">
            {generate.data.generatedContent}
          </pre>
        </div>
      )}
    </div>
  );
}

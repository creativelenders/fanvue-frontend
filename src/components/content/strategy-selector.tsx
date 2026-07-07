import type { ContentStrategy } from "../../types/content";

interface StrategySelectorProps {
  strategies: ContentStrategy[];
  selected: string;
  onSelect: (slug: string) => void;
  isLoading?: boolean;
}

export function StrategySelector({
  strategies,
  selected,
  onSelect,
  isLoading = false,
}: StrategySelectorProps) {
  if (isLoading) {
    return (
      <div className="flex gap-2 overflow-x-auto pb-2">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="flex-shrink-0 w-32 h-16 rounded-lg bg-glass-base border border-glass-border animate-pulse"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
      {strategies.map((strategy) => (
        <button
          key={strategy.id}
          type="button"
          onClick={() => onSelect(strategy.slug)}
          className={`flex-shrink-0 px-4 py-3 rounded-lg text-left transition-all duration-200 border ${
            selected === strategy.slug
              ? "bg-primary-cyan/10 border-primary-cyan/50 text-primary-cyan shadow-glow"
              : "bg-glass-base border-glass-border text-text-muted hover:text-text-main hover:border-glass-border-hover"
          }`}
        >
          <p className="text-sm font-medium">{strategy.name}</p>
          <p className="text-xs opacity-60 mt-0.5 capitalize">{strategy.platform}</p>
        </button>
      ))}
    </div>
  );
}

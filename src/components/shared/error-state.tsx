import { AlertTriangle } from "lucide-react";

export function ErrorState({ message, onRetry }: { message?: string; onRetry?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center glass-card border-status-danger/20">
      <div className="w-12 h-12 rounded-full bg-status-danger/10 flex items-center justify-center mb-4">
        <AlertTriangle className="w-6 h-6 text-status-danger" />
      </div>
      <p className="text-text-main font-medium mb-1">Something went wrong</p>
      <p className="text-sm text-text-muted mb-6 max-w-md">
        {message || "We encountered an error loading this data. Please try again."}
      </p>
      {onRetry && (
        <button 
          onClick={onRetry} 
          className="px-4 py-2 bg-glass-light hover:bg-glass-border text-text-main rounded-md transition-colors text-sm font-medium"
        >
          Try Again
        </button>
      )}
    </div>
  );
}

import { Loader2 } from "lucide-react";

export function LoadingState({ message = "Loading..." }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center h-64">
      <Loader2 className="w-8 h-8 text-primary-cyan animate-spin mb-4" />
      <p className="text-sm text-text-muted animate-pulse">{message}</p>
    </div>
  );
}

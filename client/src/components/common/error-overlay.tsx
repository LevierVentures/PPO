import { useAppState } from "@/hooks/use-app-state";
import { X } from "lucide-react";

export default function ErrorOverlay() {
  const { state, clearError } = useAppState();

  if (!state.errorMessage) return null;

  return (
    <div className="error-overlay show">
      <div className="flex items-center justify-center gap-2">
        <span>{state.errorMessage}</span>
        <button
          onClick={clearError}
          className="ml-2 hover:bg-destructive-foreground/20 rounded p-1"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

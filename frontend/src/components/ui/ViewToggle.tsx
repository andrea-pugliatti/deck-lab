import { LayoutGrid, List } from "lucide-react";

import type { ViewMode } from "../../hooks/useViewPreference";

/**
 * Props for the {@link ViewToggle} component.
 */
export interface ViewToggleProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  className?: string;
}

/**
 * ViewToggle component renders a layout view mode selector (Grid / List).
 * Uses styled native buttons to ensure exact border-radii consistency and
 * prevent focus-ring flashing.
 *
 * @param props - The component properties.
 * @returns The rendered ViewToggle component.
 */
export default function ViewToggle({
  viewMode,
  onViewModeChange,
  className = "",
}: ViewToggleProps) {
  return (
    <div
      className={`border-border-dim/60 bg-dark-surface/40 flex items-center gap-1 rounded-lg border p-1 backdrop-blur-sm ${className}`}
    >
      <button
        onClick={() => onViewModeChange("grid")}
        className={`focus-visible:ring-cyan-accent flex size-8 cursor-pointer items-center justify-center rounded-md transition-all duration-200 select-none focus-visible:ring-2 focus-visible:outline-hidden ${
          viewMode === "grid"
            ? "bg-cyan-accent/15 text-cyan-accent border-cyan-accent/20 shadow-glow-cyan-sm border"
            : "hover:bg-dark-surface-elevated/40 border border-transparent text-slate-400 hover:text-white"
        }`}
        title="Grid View"
        aria-label="Grid View"
        type="button"
      >
        <LayoutGrid className="size-4" aria-hidden="true" />
      </button>
      <button
        onClick={() => onViewModeChange("list")}
        className={`focus-visible:ring-cyan-accent flex size-8 cursor-pointer items-center justify-center rounded-md transition-all duration-200 select-none focus-visible:ring-2 focus-visible:outline-hidden ${
          viewMode === "list"
            ? "bg-cyan-accent/15 text-cyan-accent border-cyan-accent/20 shadow-glow-cyan-sm border"
            : "hover:bg-dark-surface-elevated/40 border border-transparent text-slate-400 hover:text-white"
        }`}
        title="List View"
        aria-label="List View"
        type="button"
      >
        <List className="size-4" aria-hidden="true" />
      </button>
    </div>
  );
}

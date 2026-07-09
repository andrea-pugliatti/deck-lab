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
        className={`flex h-8 w-8 cursor-pointer items-center justify-center rounded-md transition-all duration-200 outline-none select-none focus:ring-0 focus:outline-none focus-visible:ring-0 focus-visible:outline-none ${
          viewMode === "grid"
            ? "bg-cyan-accent/15 text-cyan-accent border-cyan-accent/20 border shadow-[0_0_10px_rgba(95,227,217,0.12)]"
            : "hover:bg-dark-surface-elevated/40 border border-transparent text-slate-400 hover:text-white"
        }`}
        title="Grid View"
        aria-label="Grid View"
        type="button"
      >
        <LayoutGrid className="h-4 w-4" />
      </button>
      <button
        onClick={() => onViewModeChange("list")}
        className={`flex h-8 w-8 cursor-pointer items-center justify-center rounded-md transition-all duration-200 outline-none select-none focus:ring-0 focus:outline-none focus-visible:ring-0 focus-visible:outline-none ${
          viewMode === "list"
            ? "bg-cyan-accent/15 text-cyan-accent border-cyan-accent/20 border shadow-[0_0_10px_rgba(95,227,217,0.12)]"
            : "hover:bg-dark-surface-elevated/40 border border-transparent text-slate-400 hover:text-white"
        }`}
        title="List View"
        aria-label="List View"
        type="button"
      >
        <List className="h-4 w-4" />
      </button>
    </div>
  );
}

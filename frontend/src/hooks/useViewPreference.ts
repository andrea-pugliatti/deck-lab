import { useState } from "react";

export type ViewMode = "grid" | "list";

/**
 * Custom hook to manage and persist a view layout preference (grid or list) in localStorage.
 *
 * @param key - The localStorage key under which to persist the preference.
 * @param defaultValue - The fallback view mode if no preference is stored.
 * @returns A tuple containing the active view mode and a function to update it.
 */
export function useViewPreference(
  key: string,
  defaultValue: ViewMode = "grid",
): [ViewMode, (mode: ViewMode) => void] {
  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored === "grid" || stored === "list" ? stored : defaultValue;
    } catch (e) {
      console.warn("localStorage view preference read failed:", e);
      return defaultValue;
    }
  });

  const setAndStoreMode = (mode: ViewMode) => {
    setViewMode(mode);
    try {
      localStorage.setItem(key, mode);
    } catch (e) {
      console.warn("localStorage view preference write failed:", e);
    }
  };

  return [viewMode, setAndStoreMode];
}

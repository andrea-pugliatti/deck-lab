import type { ComponentType, ReactNode } from "react";

/**
 * Props for the {@link EmptyState} component.
 */
export interface EmptyStateProps {
  icon?: ComponentType<{ className?: string }>;
  title: string;
  description?: string;
  children?: ReactNode;
}

/**
 * A standard UI component displayed when there is no data or content to show.
 * Supports rendering a centered placeholder layout with an icon, title, description,
 * and custom call-to-action children.
 */
export default function EmptyState({ icon: Icon, title, description, children }: EmptyStateProps) {
  return (
    <div className="border-border-dim bg-dark-surface/10 flex flex-col items-center justify-center rounded-lg border border-dashed py-16 text-center">
      {Icon && <Icon className="mx-auto mb-3 h-8 w-8 text-slate-600" />}
      <p className="mb-1 text-sm text-slate-400">{title}</p>
      {description && <p className="mb-4 text-xs text-slate-600">{description}</p>}
      {children}
    </div>
  );
}

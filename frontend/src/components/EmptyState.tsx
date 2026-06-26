import type { ComponentType, ReactNode } from "react";

interface EmptyStateProps {
  icon?: ComponentType<{ className?: string }>;
  title: string;
  description?: string;
  children?: ReactNode;
}

export default function EmptyState({ icon: Icon, title, description, children }: EmptyStateProps) {
  return (
    <div className="text-center py-16 border border-dashed border-border-dim rounded-lg bg-dark-surface/10 flex flex-col items-center justify-center">
      {Icon && <Icon className="w-8 h-8 text-slate-600 mx-auto mb-3" />}
      <p className="text-slate-400 text-sm mb-1">{title}</p>
      {description && <p className="text-slate-600 text-xs mb-4">{description}</p>}
      {children}
    </div>
  );
}

import type { ReactNode } from "react";

export interface PageHeaderProps {
  title: string;
  description: string;
  children?: ReactNode;
}

export default function PageHeader({ title, description, children }: PageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 border-b border-border-dim pb-6">
      <div>
        <h1 className="font-display text-3xl font-bold text-white mb-2">{title}</h1>
        <p className="text-sm text-slate-400">{description}</p>
      </div>
      {children && <div className="flex items-center gap-2">{children}</div>}
    </div>
  );
}

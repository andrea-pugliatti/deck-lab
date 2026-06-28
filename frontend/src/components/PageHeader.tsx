import type { ReactNode } from "react";

export interface PageHeaderProps {
  title: string;
  description: string;
  children?: ReactNode;
}

export default function PageHeader({ title, description, children }: PageHeaderProps) {
  return (
    <div className="border-border-dim mb-8 flex flex-col justify-between gap-4 border-b pb-6 sm:flex-row sm:items-center">
      <div>
        <h1 className="font-display mb-2 text-3xl font-bold text-white">{title}</h1>
        <p className="text-sm text-slate-400">{description}</p>
      </div>
      {children && <div className="flex items-center gap-2">{children}</div>}
    </div>
  );
}

import { ChevronLeft, ChevronRight } from "lucide-react";

export interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  variant?: "default" | "compact";
}

export default function Pagination({
  page,
  totalPages,
  onPageChange,
  variant = "default",
}: PaginationProps) {
  const isCompact = variant === "compact";

  const containerClass = `flex items-center w-full ${
    isCompact
      ? "mt-4 pt-3 border-t border-border-dim/60 text-xs text-slate-500"
      : "justify-center gap-4 mt-12 pt-6 border-t border-border-dim/50"
  }`;

  const textClass = isCompact ? "order-1 mr-auto" : "order-2 text-sm text-slate-400 font-semibold";

  const baseButtonClass =
    "border border-border-dim rounded bg-dark-surface-elevated text-slate-400 hover:text-cyan-accent disabled:opacity-30 disabled:hover:text-slate-400 cursor-pointer disabled:cursor-not-allowed";

  const prevButtonClass = `${baseButtonClass} ${
    isCompact
      ? "order-2 mr-2 p-1"
      : "order-1 p-2 hover:border-cyan-accent disabled:hover:border-border-dim transition-all duration-200"
  }`;

  const nextButtonClass = `${baseButtonClass} ${
    isCompact
      ? "order-3 p-1"
      : "order-3 p-2 hover:border-cyan-accent disabled:hover:border-border-dim transition-all duration-200"
  }`;

  const iconSize = isCompact ? "w-4 h-4" : "w-5 h-5";

  return (
    <div className={containerClass}>
      <button
        onClick={() => onPageChange(Math.max(0, page - 1))}
        disabled={page === 0}
        className={prevButtonClass}
        type="button"
      >
        <ChevronLeft className={iconSize} />
      </button>

      <span className={textClass}>
        Page {page + 1} of {totalPages}
      </span>

      <button
        onClick={() => onPageChange(Math.min(totalPages - 1, page + 1))}
        disabled={page >= totalPages - 1}
        className={nextButtonClass}
        type="button"
      >
        <ChevronRight className={iconSize} />
      </button>
    </div>
  );
}

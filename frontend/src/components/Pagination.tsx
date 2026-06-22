import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-4 mt-12 pt-6 border-t border-border-dim/50">
      <button
        onClick={() => onPageChange(Math.max(0, page - 1))}
        disabled={page === 0}
        className="p-2 border border-border-dim rounded bg-dark-surface-elevated text-slate-400 hover:text-cyan-accent hover:border-cyan-accent disabled:opacity-30 disabled:hover:text-slate-400 disabled:hover:border-border-dim transition-all duration-200 cursor-pointer disabled:cursor-not-allowed"
        type="button"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <span className="text-sm text-slate-400 font-semibold">
        Page {page + 1} of {totalPages}
      </span>
      <button
        onClick={() => onPageChange(Math.min(totalPages - 1, page + 1))}
        disabled={page >= totalPages - 1}
        className="p-2 border border-border-dim rounded bg-dark-surface-elevated text-slate-400 hover:text-cyan-accent hover:border-cyan-accent disabled:opacity-30 disabled:hover:text-slate-400 disabled:hover:border-border-dim transition-all duration-200 cursor-pointer disabled:cursor-not-allowed"
        type="button"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
}

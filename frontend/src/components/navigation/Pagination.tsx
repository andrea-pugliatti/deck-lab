import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link, useSearchParams } from "react-router";

/**
 * Props for the {@link Pagination} component.
 */
export interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange?: (page: number) => void;
  getPageUrl?: (page: number) => string;
  variant?: "default" | "compact";
}

/**
 * An accessible pagination control component.
 *
 * Prefers semantic `<Link>` navigation when syncing with URL search parameters
 * (supporting right-click/new-tab, middle click, screen readers, and history stack navigation),
 * while supporting `<button>` interaction for in-memory / embedded components.
 *
 * @param props - The component properties.
 * @returns The rendered pagination navigation control.
 */
export default function Pagination({
  page,
  totalPages,
  onPageChange,
  getPageUrl,
  variant = "default",
}: PaginationProps) {
  const [searchParams] = useSearchParams();
  const isCompact = variant === "compact";

  if (totalPages <= 0) {
    return null;
  }

  const containerClass = `flex items-center w-full ${
    isCompact
      ? "mt-4 pt-3 border-t border-border-dim/60 text-xs text-slate-500"
      : "justify-center gap-4 mt-12 pt-6 border-t border-border-dim/50"
  }`;

  const textClass = isCompact ? "order-1 mr-auto" : "order-2 text-sm text-slate-400 font-semibold";

  const baseControlClass =
    "inline-flex items-center justify-center border border-border-dim rounded bg-dark-surface-elevated text-slate-400 hover:text-cyan-accent disabled:opacity-30 disabled:hover:text-slate-400 cursor-pointer disabled:cursor-not-allowed no-underline transition-colors duration-150 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-cyan-accent";

  const prevClass = `${baseControlClass} ${
    isCompact
      ? "order-2 mr-2 p-1"
      : "order-1 p-2 hover:border-cyan-accent disabled:hover:border-border-dim"
  }`;

  const nextClass = `${baseControlClass} ${
    isCompact
      ? "order-3 p-1"
      : "order-3 p-2 hover:border-cyan-accent disabled:hover:border-border-dim"
  }`;

  const iconSize = isCompact ? "size-4" : "size-5";

  // Determine URL generator when in Link mode
  const defaultGetPageUrl = (targetPage: number) => {
    const params = new URLSearchParams(searchParams);
    if (targetPage <= 0) {
      params.delete("page");
    } else {
      params.set("page", String(targetPage));
    }
    const queryString = params.toString();
    return queryString ? `?${queryString}` : "";
  };

  const isLinkMode = Boolean(getPageUrl || !onPageChange);
  const resolvePageUrl = getPageUrl || defaultGetPageUrl;

  const isPrevDisabled = page <= 0;
  const isNextDisabled = page >= totalPages - 1;

  const renderPrevControl = () => {
    if (!isLinkMode) {
      return (
        <button
          onClick={() => onPageChange?.(Math.max(0, page - 1))}
          disabled={isPrevDisabled}
          className={prevClass}
          type="button"
          aria-label="Previous page"
        >
          <ChevronLeft className={iconSize} aria-hidden="true" />
        </button>
      );
    }

    if (isPrevDisabled) {
      return (
        <span
          aria-disabled="true"
          className={`${prevClass} pointer-events-none cursor-not-allowed opacity-30`}
          aria-label="Previous page (disabled)"
        >
          <ChevronLeft className={iconSize} aria-hidden="true" />
        </span>
      );
    }

    return (
      <Link
        to={resolvePageUrl(page - 1)}
        viewTransition
        className={prevClass}
        aria-label="Previous page"
        onClick={() => onPageChange?.(page - 1)}
      >
        <ChevronLeft className={iconSize} aria-hidden="true" />
      </Link>
    );
  };

  const renderNextControl = () => {
    if (!isLinkMode) {
      return (
        <button
          onClick={() => onPageChange?.(Math.min(totalPages - 1, page + 1))}
          disabled={isNextDisabled}
          className={nextClass}
          type="button"
          aria-label="Next page"
        >
          <ChevronRight className={iconSize} aria-hidden="true" />
        </button>
      );
    }

    if (isNextDisabled) {
      return (
        <span
          aria-disabled="true"
          className={`${nextClass} pointer-events-none cursor-not-allowed opacity-30`}
          aria-label="Next page (disabled)"
        >
          <ChevronRight className={iconSize} aria-hidden="true" />
        </span>
      );
    }

    return (
      <Link
        to={resolvePageUrl(page + 1)}
        viewTransition
        className={nextClass}
        aria-label="Next page"
        onClick={() => onPageChange?.(page + 1)}
      >
        <ChevronRight className={iconSize} aria-hidden="true" />
      </Link>
    );
  };

  return (
    <nav aria-label="Pagination" className={containerClass}>
      {renderPrevControl()}

      <span className={textClass} aria-current="page">
        Page {page + 1} of {totalPages}
      </span>

      {renderNextControl()}
    </nav>
  );
}

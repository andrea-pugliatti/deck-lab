/**
 * Props for the {@link ShowingPageIndicator} component.
 */
export interface ShowingPageIndicatorProps {
  page: number;
  pageSize?: number;
  totalElements: number;
  itemType: "deck" | "card";
  className?: string;
}

/**
 * A standard helper component that textually describes the range of items currently displayed
 * in a paginated list (e.g., "Showing 1-9 of 50 decks").
 */
export default function ShowingPageIndicator({
  page,
  pageSize = 9,
  totalElements,
  itemType,
  className,
}: ShowingPageIndicatorProps) {
  return (
    <div className={`flex items-center justify-between text-xs text-slate-500 ${className}`}>
      <span>
        Showing{" "}
        {totalElements > 0
          ? `${page * pageSize + 1}-${Math.min((page + 1) * pageSize, totalElements)}`
          : "0"}{" "}
        of {totalElements} {itemType}s
      </span>
    </div>
  );
}

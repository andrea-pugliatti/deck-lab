interface ShowingPageIndicatorProps {
  page: number;
  pageSize?: number;
  totalElements: number;
  itemType: "deck" | "card";
  className?: string;
}

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

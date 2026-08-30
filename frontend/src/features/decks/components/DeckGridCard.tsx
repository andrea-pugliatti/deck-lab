import { Calendar, Edit, Layers, Trash2 } from "lucide-react";
import { Link } from "react-router";

import Badge from "../../../components/ui/Badge";
import Button, { getButtonClasses } from "../../../components/ui/Button";
import type { Format } from "../../../types";
import { formatRelativeTime } from "../../../utils/date";

/**
 * Properties for the {@link DeckGridCard} component.
 */
export interface DeckGridCardProps {
  id: number;
  name: string;
  description?: string;
  formatName: Format;
  cardCount: number;
  updatedAt?: string;
  creatorUsername?: string;
  showActions?: boolean;
  onDelete?: (id: number) => void;
  onSelect?: (id: number) => void;
}

/**
 * DeckGridCard component renders a visual card summarizing a deck's details,
 * including format, name, description, card count, and last updated time.
 *
 * It supports standard navigation to the deck details or inline selection/actions.
 *
 * @param props - The component properties.
 * @returns The rendered deck card.
 */
export default function DeckGridCard({
  id,
  name,
  description,
  formatName,
  cardCount,
  updatedAt,
  creatorUsername,
  showActions = false,
  onDelete,
  onSelect,
}: DeckGridCardProps) {
  const formatLabel = formatName || "Unknown";
  const badgeVariant = formatLabel.toLowerCase().includes("tcg") ? "cyan" : "gold";

  const cardBody = (
    <div className="mb-4">
      <div className="mb-3 flex items-center justify-between">
        <Badge variant={badgeVariant}>{formatLabel}</Badge>
        <span className="text-[10px] font-semibold tracking-wider text-slate-500 uppercase">
          by {creatorUsername || "Community"}
        </span>
      </div>
      <h3 className="font-display group-hover:text-cyan-accent mb-2 line-clamp-1 text-lg leading-snug font-bold text-white transition-colors duration-200">
        {onSelect ? (
          name
        ) : showActions ? (
          <Link
            to={`/decks/${id}`}
            viewTransition
            className="after:absolute after:inset-0 after:content-[''] focus:outline-none"
          >
            {name}
          </Link>
        ) : (
          name
        )}
      </h3>
      <p className="line-clamp-2 text-xs leading-relaxed text-slate-400">
        {description || "No description provided."}
      </p>
    </div>
  );

  const cardFooter = (
    <div className="border-border-dim/60 mt-auto flex items-center justify-between gap-4 border-t pt-4">
      <div className="flex gap-4 text-xs text-slate-400">
        <span className="flex items-center gap-1.5 font-medium">
          <Layers className="text-cyan-accent h-3.5 w-3.5" />
          {cardCount} Cards
        </span>
        {updatedAt && (
          <span className="flex items-center gap-1.5 text-slate-500">
            <Calendar className="h-3.5 w-3.5" />
            {formatRelativeTime(updatedAt)}
          </span>
        )}
      </div>

      {onSelect ? (
        <Button
          variant="primary"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            onSelect(id);
          }}
          className="rounded-lg px-3.5 py-1.5 text-[9px] font-bold tracking-wider uppercase transition-all group-hover:shadow-[0_0_12px_rgba(226,197,111,0.25)]"
        >
          Select
        </Button>
      ) : (
        showActions && (
          <div className="relative z-10 flex items-center gap-2">
            <Link
              to={`/decks/${id}/edit`}
              viewTransition
              className={getButtonClasses({ variant: "outline", size: "icon" })}
              onClick={(e) => {
                e.stopPropagation();
              }}
              title="Edit Deck"
            >
              <Edit className="h-4 w-4" />
            </Link>
            <Button
              variant="outline-red"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                onDelete?.(id);
              }}
              title="Delete Deck"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )
      )}
    </div>
  );

  const containerClasses =
    "bg-dark-surface/40 backdrop-blur-sm border border-border-dim/60 hover-hologram rounded-xl p-5 flex flex-col justify-between min-h-56 transition-all duration-300 relative overflow-hidden hover:border-cyan-accent/50 hover:shadow-[0_4px_25px_rgba(95,227,217,0.08)] before:content-[''] before:absolute before:top-0 before:left-0 before:w-0.5 before:h-full before:bg-gold-accent before:opacity-0 before:transition-opacity before:duration-200 hover:before:opacity-100 group no-underline text-inherit text-left w-full";

  if (onSelect) {
    return (
      <button
        type="button"
        onClick={() => onSelect(id)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onSelect(id);
          }
        }}
        className={`${containerClasses} cursor-pointer`}
      >
        {cardBody}
        {cardFooter}
      </button>
    );
  }

  if (showActions) {
    return (
      <div className={containerClasses}>
        {cardBody}
        {cardFooter}
      </div>
    );
  }

  return (
    <Link to={`/decks/${id}`} viewTransition className={`${containerClasses} cursor-pointer`}>
      {cardBody}
      {cardFooter}
    </Link>
  );
}

import { Calendar, Edit, Layers, Trash2 } from "lucide-react";
import { Link } from "react-router";

import Badge from "../../../components/ui/Badge";
import Button, { getButtonClasses } from "../../../components/ui/Button";
import { formatRelativeTime } from "../../../utils/date";
import type { DeckGridCardProps } from "./DeckGridCard";

/**
 * DeckListCard component renders a visual row summarizing a deck's details,
 * including format, name, description, card count, and last updated time.
 *
 * Designed to support list-mode views. It matches the prop contract of {@link DeckGridCard}.
 *
 * @param props - The component properties.
 * @returns The rendered deck list row.
 */
export default function DeckListCard({
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
    <div className="flex min-w-0 items-start gap-4">
      <div className="bg-dark-surface-elevated text-gold-accent border-border-dim/60 group-hover:border-cyan-accent/30 group-hover:text-cyan-accent shrink-0 rounded-lg border p-3 transition-colors duration-200">
        <Layers className="h-6 w-6" />
      </div>
      <div className="min-w-0">
        <div className="mb-1.5 flex flex-wrap items-center gap-2">
          <h3 className="font-display group-hover:text-cyan-accent text-base font-bold text-white transition-colors duration-200">
            {onSelect ? (
              name
            ) : showActions ? (
              <Link
                to={`/decks/${id}`}
                viewTransition
                className="focus-visible:ring-cyan-accent rounded-xl after:absolute after:inset-0 after:content-[''] focus:outline-none focus-visible:ring-2"
              >
                {name}
              </Link>
            ) : (
              name
            )}
          </h3>
          <Badge variant={badgeVariant}>{formatLabel}</Badge>
          <span className="text-2xs font-semibold tracking-wider text-slate-500 uppercase">
            by {creatorUsername || "Community"}
          </span>
        </div>
        <p className="line-clamp-1 max-w-2xl text-xs text-slate-400">
          {description || "No description provided."}
        </p>
        <div className="text-2xs mt-2 flex gap-4 text-slate-500">
          <span className="flex items-center gap-1">
            <Layers className="h-3.5 w-3.5" />
            {cardCount} Cards
          </span>
          {updatedAt && (
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              {formatRelativeTime(updatedAt)}
            </span>
          )}
        </div>
      </div>
    </div>
  );

  const cardActions = (
    <div className="shrink-0">
      {onSelect ? (
        <Button
          variant="primary"
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            onSelect(id);
          }}
          className="text-3xs group-hover:shadow-glow-gold-card rounded-lg px-3.5 py-1.5 font-bold tracking-wider uppercase transition-all"
        >
          Select
        </Button>
      ) : (
        showActions && (
          <div className="flex items-center gap-2">
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
    "deck-card-base hover-side-gold hover-hologram p-4 flex items-center justify-between group";

  if (onSelect) {
    return (
      <div
        role="button"
        tabIndex={0}
        onClick={() => onSelect(id)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onSelect(id);
          }
        }}
        className={`${containerClasses} focus-visible:ring-cyan-accent cursor-pointer focus:outline-none focus-visible:ring-2`}
      >
        <div className="flex flex-1 flex-col justify-between gap-3 md:flex-row md:items-center">
          {cardBody}
          {cardActions}
        </div>
      </div>
    );
  }

  if (showActions) {
    return (
      <div className={containerClasses}>
        <div className="flex flex-1 flex-col justify-between gap-3 md:flex-row md:items-center">
          {cardBody}
          {cardActions}
        </div>
      </div>
    );
  }

  return (
    <Link to={`/decks/${id}`} viewTransition className={`${containerClasses} cursor-pointer`}>
      <div className="flex flex-1 flex-col justify-between gap-3 md:flex-row md:items-center">
        {cardBody}
        {cardActions}
      </div>
    </Link>
  );
}

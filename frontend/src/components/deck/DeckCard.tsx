import { Calendar, Edit, Layers, Trash2 } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { formatRelativeTime } from "../../utils/date";
import Badge from "../ui/Badge";
import Button, { getButtonClasses } from "../ui/Button";

export interface DeckCardProps {
  id: number;
  name: string;
  description?: string;
  formatName: string;
  cardCount: number;
  updatedAt?: string;
  creatorUsername?: string;
  showActions?: boolean;
  onDelete?: (id: number) => void;
  onSelect?: (id: number) => void;
}

export default function DeckCard({
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
}: DeckCardProps) {
  const navigate = useNavigate();
  const cardContent = (
    <>
      <div className="mb-4">
        <div className="flex justify-between items-center mb-3">
          <Badge variant={formatName.toLowerCase().includes("tcg") ? "cyan" : "gold"}>
            {formatName}
          </Badge>
          <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
            by {creatorUsername || "Community"}
          </span>
        </div>
        <h3 className="font-display text-lg font-bold text-white leading-snug group-hover:text-cyan-accent transition-colors duration-200 line-clamp-1 mb-2">
          {name}
        </h3>
        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
          {description || "No description provided."}
        </p>
      </div>

      <div className="flex justify-between items-center pt-4 border-t border-border-dim/60 mt-auto gap-4">
        <div className="flex gap-4 text-xs text-slate-400">
          <span className="flex items-center gap-1.5 font-medium">
            <Layers className="w-3.5 h-3.5 text-cyan-accent" />
            {cardCount} Cards
          </span>
          {updatedAt && (
            <span className="flex items-center gap-1.5 text-slate-500">
              <Calendar className="w-3.5 h-3.5" />
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
            className="font-bold uppercase tracking-wider text-[9px] px-3.5 py-1.5 rounded-lg group-hover:shadow-[0_0_12px_rgba(226,197,111,0.25)] transition-all"
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
                <Edit className="w-4 h-4" />
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
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          )
        )}
      </div>
    </>
  );

  const containerClasses =
    "bg-dark-surface/40 backdrop-blur-sm border border-border-dim/60 hover-hologram rounded-xl p-5 flex flex-col justify-between min-h-56 transition-all duration-300 cursor-pointer relative overflow-hidden hover:border-cyan-accent/50 hover:shadow-[0_4px_25px_rgba(95,227,217,0.08)] before:content-[''] before:absolute before:top-0 before:left-0 before:w-0.5 before:h-full before:bg-gold-accent before:opacity-0 before:transition-opacity before:duration-200 hover:before:opacity-100 group no-underline text-inherit text-left w-full";

  if (onSelect || showActions) {
    return (
      <div
        role="button"
        tabIndex={0}
        onClick={(e) => {
          if ((e.target as HTMLElement).closest("a, button")) {
            return;
          }
          if (onSelect) {
            onSelect(id);
          } else {
            navigate(`/decks/${id}`, { viewTransition: true });
          }
        }}
        onKeyDown={(e) => {
          if ((e.target as HTMLElement).closest("a, button")) {
            return;
          }
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            if (onSelect) {
              onSelect(id);
            } else {
              navigate(`/decks/${id}`, { viewTransition: true });
            }
          }
        }}
        className={containerClasses}
      >
        {cardContent}
      </div>
    );
  }

  return (
    <Link to={`/decks/${id}`} viewTransition className={containerClasses}>
      {cardContent}
    </Link>
  );
}

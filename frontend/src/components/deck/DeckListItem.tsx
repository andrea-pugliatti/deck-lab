import { Calendar, Edit, Layers, Trash2 } from "lucide-react";
import { Link } from "react-router";
import Badge from "../ui/Badge";
import Button, { getButtonClasses } from "../ui/Button";

export interface DeckListItemProps {
  id: number;
  name: string;
  description: string;
  formatName: string;
  cardCount: number;
  updatedAt: string;
  showActions?: boolean;
  onDelete?: (id: number) => void;
}

export default function DeckListItem({
  id,
  name,
  description,
  formatName,
  cardCount,
  updatedAt,
  showActions = true,
  onDelete,
}: DeckListItemProps) {
  return (
    <div className="bg-dark-surface border border-border-dim rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all duration-300 hover:border-border-glow hover:shadow-md">
      <Link
        to={`/decks/${id}`}
        viewTransition
        className="flex items-start gap-4 flex-1 min-w-0 no-underline text-inherit group"
      >
        <div className="p-3 bg-dark-surface-elevated rounded-lg border border-border-dim text-gold-accent shrink-0 group-hover:text-cyan-accent group-hover:border-cyan-accent/30 transition-colors">
          <Layers className="w-6 h-6" />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <h3 className="font-display text-lg font-bold text-white leading-tight group-hover:text-cyan-accent transition-colors duration-200">
              {name}
            </h3>
            <Badge variant="cyan">{formatName}</Badge>
          </div>
          <p className="text-sm text-slate-400 mb-2 max-w-xl line-clamp-1">
            {description || "No description provided."}
          </p>
          <div className="flex gap-4 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <Layers className="w-3.5 h-3.5" />
              {cardCount} Cards
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              Updated {updatedAt}
            </span>
          </div>
        </div>
      </Link>

      {showActions && (
        <div className="flex items-center gap-2 self-end md:self-center">
          <Link
            to={`/decks/${id}/edit`}
            viewTransition
            className={getButtonClasses({ variant: "outline", size: "icon" })}
            title="Edit Deck"
          >
            <Edit className="w-5 h-5" />
          </Link>
          <Button
            variant="outline-red"
            size="icon"
            onClick={() => onDelete?.(id)}
            title="Delete Deck"
          >
            <Trash2 className="w-5 h-5" />
          </Button>
        </div>
      )}
    </div>
  );
}

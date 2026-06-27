import { Calendar, Layers } from "lucide-react";
import { Link } from "react-router";
import { formatRelativeTime } from "../../utils/date";
import Badge from "../ui/Badge";

export interface DeckCardProps {
  id: number;
  name: string;
  description?: string;
  formatName: string;
  cardCount: number;
  updatedAt?: string;
  creatorUsername?: string;
}

export default function DeckCard({
  id,
  name,
  description,
  formatName,
  cardCount,
  updatedAt,
  creatorUsername,
}: DeckCardProps) {
  return (
    <Link
      to={`/decks/${id}`}
      viewTransition
      className="bg-dark-surface border border-border-dim rounded-lg p-5 flex flex-col justify-between min-h-56 transition-all duration-300 cursor-pointer relative overflow-hidden hover:-translate-y-1 hover:border-border-glow hover:shadow-lg before:content-[''] before:absolute before:top-0 before:left-0 before:w-0.5 before:h-full before:bg-gold-accent before:opacity-0 before:transition-opacity before:duration-200 hover:before:opacity-100 group no-underline text-inherit"
    >
      <div className="mb-4">
        <div className="flex justify-between items-center mb-3">
          <Badge variant="gold">{formatName}</Badge>
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

      <div className="flex justify-between items-center pt-4 border-t border-border-dim/60 mt-auto">
        <div className="flex gap-4 text-xs text-slate-400">
          <span className="flex items-center gap-1.5 font-medium">
            <Layers className="w-3.5 h-3.5 text-cyan-accent" />
            {cardCount} Cards
          </span>
          <span className="flex items-center gap-1.5 text-slate-500">
            <Calendar className="w-3.5 h-3.5" />
            {formatRelativeTime(updatedAt)}
          </span>
        </div>
      </div>
    </Link>
  );
}

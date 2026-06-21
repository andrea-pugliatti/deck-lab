import { Layers, Calendar } from "lucide-react";

export interface DeckCardProps {
  id: number;
  name: string;
  description?: string;
  formatName: string;
  cardCount: number;
  updatedAt?: string;
  creatorUsername?: string;
}

function formatRelativeTime(dateString?: string): string {
  if (!dateString) return "recently";
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 30) return `${diffDays}d ago`;

    return date.toLocaleDateString();
  } catch {
    return "recently";
  }
}

export default function DeckCard({
  name,
  description,
  formatName,
  cardCount,
  updatedAt,
  creatorUsername,
}: DeckCardProps) {
  return (
    <div className="bg-dark-surface border border-border-dim rounded-lg p-5 flex flex-col justify-between min-h-56 transition-all duration-300 cursor-pointer relative overflow-hidden hover:-translate-y-1 hover:border-border-glow hover:shadow-lg before:content-[''] before:absolute before:top-0 before:left-0 before:w-0.5 before:h-full before:bg-gold-accent before:opacity-0 before:transition-opacity before:duration-200 hover:before:opacity-100 group">
      <div className="mb-4">
        <div className="flex justify-between items-center mb-3">
          <span className="text-[10px] font-bold text-gold-accent uppercase tracking-wider bg-gold-accent/10 px-2.5 py-0.5 rounded border border-gold-accent/20">
            {formatName}
          </span>
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
    </div>
  );
}

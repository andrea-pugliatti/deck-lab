import { Layers, Calendar, Trash2, Edit } from "lucide-react";

export interface DeckListItemProps {
  id: number;
  name: string;
  description: string;
  formatName: string;
  cardCount: number;
  updatedAt: string;
}

export default function DeckListItem({
  name,
  description,
  formatName,
  cardCount,
  updatedAt,
}: DeckListItemProps) {
  return (
    <div className="bg-dark-surface border border-border-dim rounded-lg p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all duration-300 hover:border-border-glow hover:shadow-md">
      <div className="flex items-start gap-4">
        <div className="p-3 bg-dark-surface-elevated rounded-lg border border-border-dim text-gold-accent shrink-0">
          <Layers className="w-6 h-6" />
        </div>
        <div>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <h3 className="font-display text-lg font-bold text-white leading-tight">{name}</h3>
            <span className="text-[10px] font-bold text-cyan-accent uppercase tracking-wider bg-cyan-accent/10 px-2 py-0.5 rounded">
              {formatName}
            </span>
          </div>
          <p className="text-sm text-slate-400 mb-2 max-w-xl">
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
      </div>

      <div className="flex items-center gap-2 self-end md:self-center">
        <button
          className="p-2 border border-border-dim rounded bg-dark-surface-elevated text-slate-400 hover:text-cyan-accent hover:border-cyan-accent transition-all duration-200 cursor-pointer"
          title="Edit Deck"
          type="button"
        >
          <Edit className="w-4 h-4" />
        </button>
        <button
          className="p-2 border border-border-dim rounded bg-dark-surface-elevated text-slate-400 hover:text-red-400 hover:border-red-400/50 transition-all duration-200 cursor-pointer"
          title="Delete Deck"
          type="button"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

import { Eye, Heart } from "lucide-react";

export interface DeckCardProps {
  name: string;
  tier: string;
  archetype: string;
  author: string;
  views: string;
  likes: number;
}

export default function DeckCard({ name, tier, archetype, author, views, likes }: DeckCardProps) {
  return (
    <div className="bg-dark-surface border border-border-dim rounded-lg p-5 flex flex-col justify-between min-h-50 transition-all duration-300 cursor-pointer relative overflow-hidden hover:-translate-y-1 hover:border-border-glow hover:shadow-lg before:content-[''] before:absolute before:top-0 before:left-0 before:w-0.5 before:h-full before:bg-gold-accent before:opacity-0 before:transition-opacity before:duration-200 hover:before:opacity-100">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-[10px] font-bold text-gold-accent uppercase tracking-wider bg-gold-accent/10 px-2 py-0.5 rounded">
            {tier}
          </span>
          <span className="text-[10px] text-slate-500 uppercase tracking-wide">{archetype}</span>
        </div>
        <h3 className="font-display text-lg font-bold text-white leading-snug">{name}</h3>
      </div>
      <div className="flex justify-between items-center pt-4 border-t border-border-dim">
        <span className="text-xs text-slate-500">by {author}</span>
        <div className="flex gap-3 text-xs text-slate-400">
          <span className="flex items-center gap-1">
            <Eye className="w-3.5 h-3.5 text-slate-500" />
            {views}
          </span>
          <span className="flex items-center gap-1">
            <Heart className="w-3.5 h-3.5 text-slate-500" />
            {likes}
          </span>
        </div>
      </div>
    </div>
  );
}

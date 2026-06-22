import { Link } from "react-router";

export interface DeckGridItemProps {
  cardId: number;
  name: string;
  type?: string;
  imageUrl?: string;
  quantity: number;
}

export default function DeckGridItem({
  cardId,
  name,
  type,
  imageUrl,
  quantity,
}: DeckGridItemProps) {
  const isMonster = type?.toLowerCase().includes("monster") || false;
  const isSpell = type?.toLowerCase().includes("spell") || false;
  const isTrap = type?.toLowerCase().includes("trap") || false;

  let badgeColor = "border-slate-500/20 text-slate-400 bg-slate-500/5";
  if (isSpell) {
    badgeColor = "border-emerald-500/20 text-emerald-400 bg-emerald-500/5";
  } else if (isTrap) {
    badgeColor = "border-rose-500/20 text-rose-400 bg-rose-500/5";
  } else if (isMonster) {
    badgeColor = "border-amber-500/20 text-amber-400 bg-amber-500/5";
  }

  return (
    <Link
      to={`/cards/${cardId}`}
      className="group relative flex flex-col bg-dark-surface-elevated/40 hover:bg-dark-surface-elevated border border-border-dim rounded-xl overflow-hidden transition-all duration-200 hover:border-border-glow hover:shadow-md no-underline"
    >
      <div className="relative aspect-video w-full overflow-hidden bg-slate-900 border-b border-border-dim/40 flex items-center justify-center">
        {imageUrl ? (
          <img
            src={`/api/${imageUrl}`}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <span className="text-[10px] text-slate-600 font-bold uppercase tracking-wider">
            [ {name.substring(0, 3)} ]
          </span>
        )}
        <span className="absolute bottom-1 right-1 font-mono text-[10px] font-bold text-white bg-slate-900/85 px-1.5 py-0.5 rounded border border-white/10 shadow-sm">
          x{quantity}
        </span>
      </div>

      <div className="p-3 flex-1 flex flex-col justify-between">
        <h4 className="text-xs font-bold text-white group-hover:text-cyan-accent transition-colors duration-150 line-clamp-1 mb-1 font-sans">
          {name}
        </h4>
        {type && (
          <span
            className={`text-[8px] font-bold uppercase tracking-wider px-1 py-0.5 rounded border self-start ${badgeColor}`}
          >
            {type.replace(" Monster", "").replace(" Card", "")}
          </span>
        )}
      </div>
    </Link>
  );
}

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
      className="group bg-dark-surface-elevated/40 hover:bg-dark-surface-elevated border-border-dim hover:border-border-glow relative flex flex-col overflow-hidden rounded-xl border no-underline transition-all duration-200 hover:shadow-md"
    >
      <div className="border-border-dim/40 relative flex aspect-video w-full items-center justify-center overflow-hidden border-b bg-slate-900">
        {imageUrl ? (
          <img
            src={`/api/${imageUrl}`}
            alt={name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <span className="text-[10px] font-bold tracking-wider text-slate-600 uppercase">
            [ {name.substring(0, 3)} ]
          </span>
        )}
        <span className="absolute right-1 bottom-1 rounded border border-white/10 bg-slate-900/85 px-1.5 py-0.5 font-mono text-[10px] font-bold text-white shadow-sm">
          x{quantity}
        </span>
      </div>

      <div className="flex flex-1 flex-col justify-between p-3">
        <h4 className="group-hover:text-cyan-accent mb-1 line-clamp-1 font-sans text-xs font-bold text-white transition-colors duration-150">
          {name}
        </h4>
        {type && (
          <span
            className={`self-start rounded border px-1 py-0.5 text-[8px] font-bold tracking-wider uppercase ${badgeColor}`}
          >
            {type.replace(" Monster", "").replace(" Card", "")}
          </span>
        )}
      </div>
    </Link>
  );
}

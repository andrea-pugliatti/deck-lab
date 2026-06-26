import { Eye, Flame, Shield, Star } from "lucide-react";
import type { SimulatorCardInstance } from "../../types";
import Badge from "../ui/Badge";

interface CardInspectorProps {
  inspectedCard?: SimulatorCardInstance;
}

export default function CardInspector({ inspectedCard }: CardInspectorProps) {
  return (
    <aside className="lg:col-span-3 space-y-6">
      <div className="bg-dark-surface border border-border-dim rounded-2xl p-5 shadow-lg relative min-h-112.5 flex flex-col">
        <div className="absolute inset-0 bg-radial from-cyan-accent/5 via-transparent to-transparent pointer-events-none"></div>

        <h3 className="font-display text-sm font-bold text-white mb-4 border-b border-border-dim/60 pb-2 uppercase tracking-wider flex items-center gap-2">
          <Eye className="w-4 h-4 text-cyan-accent" />
          Card Inspector
        </h3>

        {inspectedCard ? (
          <div className="flex-1 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="aspect-244/356 w-full max-w-50 mx-auto rounded-lg overflow-hidden border border-border-dim shadow-md bg-slate-950">
                {inspectedCard.imageUrl ? (
                  <img
                    src={`/api/${inspectedCard.imageUrl}`}
                    alt={inspectedCard.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-600 text-xs">
                    [ No Art ]
                  </div>
                )}
              </div>

              <div>
                <h4 className="font-display text-base font-bold text-white line-clamp-2 leading-tight">
                  {inspectedCard.name}
                </h4>
                <div className="flex flex-wrap gap-2 mt-2">
                  <Badge
                    variant={
                      inspectedCard.type?.toLowerCase().includes("monster")
                        ? "monster"
                        : inspectedCard.type?.toLowerCase().includes("spell")
                          ? "spell"
                          : inspectedCard.type?.toLowerCase().includes("trap")
                            ? "trap"
                            : "default"
                    }
                  >
                    {inspectedCard.type}
                  </Badge>
                  {inspectedCard.attribute && (
                    <span className="text-[9px] font-bold text-white bg-slate-900 border border-border-dim/60 px-1.5 py-0.5 rounded uppercase">
                      {inspectedCard.attribute}
                    </span>
                  )}
                </div>
              </div>

              {inspectedCard.type?.toLowerCase().includes("monster") &&
                (inspectedCard.atk !== undefined ||
                  inspectedCard.def !== undefined ||
                  inspectedCard.level !== undefined) && (
                  <div className="grid grid-cols-2 gap-2 text-[10px] font-semibold text-slate-300 bg-dark-surface-elevated/40 border border-border-dim/50 rounded-lg p-2">
                    {inspectedCard.atk !== undefined && (
                      <div className="flex items-center gap-1.5">
                        <Flame className="w-3.5 h-3.5 text-amber-500" />
                        <span>ATK: {inspectedCard.atk === -1 ? "?" : inspectedCard.atk}</span>
                      </div>
                    )}
                    {inspectedCard.def !== undefined && (
                      <div className="flex items-center gap-1.5">
                        <Shield className="w-3.5 h-3.5 text-blue-400" />
                        <span>DEF: {inspectedCard.def === -1 ? "?" : inspectedCard.def}</span>
                      </div>
                    )}
                    {inspectedCard.level !== undefined && (
                      <div className="col-span-2 flex items-center gap-1 mt-1 text-gold-accent border-t border-border-dim/20 pt-1">
                        <Star className="w-3 h-3 fill-current" />
                        <span>Level {inspectedCard.level}</span>
                      </div>
                    )}
                  </div>
                )}

              <div className="max-h-40 overflow-y-auto pr-1 bg-dark-surface-elevated/20 border border-border-dim/40 rounded-xl p-3 text-[11px] text-slate-400 leading-relaxed font-sans font-light whitespace-pre-line">
                {inspectedCard.description || "No card details available."}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-slate-500">
            <Eye className="w-8 h-8 mb-2 text-slate-700" />
            <p className="text-xs font-semibold uppercase tracking-wider">No Card Inspected</p>
            <p className="text-[11px] text-slate-600 mt-1 max-w-45">
              Hover over a card or click its detail icon to view descriptions.
            </p>
          </div>
        )}
      </div>
    </aside>
  );
}

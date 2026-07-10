import { Eye, Flame, Shield, Star } from "lucide-react";

import type { SimulatorCardInstance } from "../../types";
import { getCardTheme } from "../../utils/card";
import Badge from "../ui/Badge";

/**
 * Props for the {@link CardInspector} component.
 */
interface CardInspectorProps {
  inspectedCard?: SimulatorCardInstance;
}

/**
 * CardInspector component.
 * Renders a side panel that displays detailed attributes, stats (ATK, DEF, Level),
 * and the card description text of a hovered or selected simulator card.
 *
 * @param props - The component props.
 * @returns A JSX element containing the detailed card inspector UI.
 */
export default function CardInspector({ inspectedCard }: CardInspectorProps) {
  const apiBaseUrl = import.meta.env.DEV ? "" : import.meta.env.VITE_API_URL || "";

  return (
    <div className="bg-dark-surface border-border-dim relative flex min-h-112.5 flex-col rounded-2xl border p-5 shadow-lg">
      <div className="from-cyan-accent/5 pointer-events-none absolute inset-0 bg-radial via-transparent to-transparent"></div>

      <h3 className="font-display border-border-dim/60 mb-4 flex items-center gap-2 border-b pb-2 text-sm font-bold tracking-wider text-white uppercase">
        <Eye className="text-cyan-accent h-4 w-4" />
        Card Inspector
      </h3>

      {inspectedCard ? (
        <div className="flex flex-1 flex-col justify-between">
          <div className="space-y-4">
            <div className="border-border-dim mx-auto aspect-244/356 w-full max-w-50 overflow-hidden rounded-lg border bg-slate-950 shadow-md">
              {inspectedCard.imageUrl ? (
                <img
                  src={`${apiBaseUrl}/api/${inspectedCard.imageUrl}`}
                  alt={inspectedCard.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-xs text-slate-600">
                  [ No Art ]
                </div>
              )}
            </div>

            <div>
              <h4 className="font-display line-clamp-2 text-base leading-tight font-bold text-white">
                {inspectedCard.name}
              </h4>
              <div className="mt-2 flex flex-wrap gap-2">
                <Badge variant={getCardTheme(inspectedCard.type).badgeVariant}>
                  {inspectedCard.type}
                </Badge>
                {inspectedCard.attribute && (
                  <span className="border-border-dim/60 rounded border bg-slate-900 px-1.5 py-0.5 text-[9px] font-bold text-white uppercase">
                    {inspectedCard.attribute}
                  </span>
                )}
              </div>
            </div>

            {inspectedCard.type?.toLowerCase().includes("monster") &&
              (inspectedCard.atk !== undefined ||
                inspectedCard.def !== undefined ||
                inspectedCard.level !== undefined) && (
                <div className="bg-dark-surface-elevated/40 border-border-dim/50 grid grid-cols-2 gap-2 rounded-lg border p-2 text-[10px] font-semibold text-slate-300">
                  {inspectedCard.atk !== undefined && (
                    <div className="flex items-center gap-1.5">
                      <Flame className="h-3.5 w-3.5 text-amber-500" />
                      <span>ATK: {inspectedCard.atk === -1 ? "?" : inspectedCard.atk}</span>
                    </div>
                  )}
                  {inspectedCard.def !== undefined && (
                    <div className="flex items-center gap-1.5">
                      <Shield className="h-3.5 w-3.5 text-blue-400" />
                      <span>DEF: {inspectedCard.def === -1 ? "?" : inspectedCard.def}</span>
                    </div>
                  )}
                  {inspectedCard.level !== undefined && (
                    <div className="text-gold-accent border-border-dim/20 col-span-2 mt-1 flex items-center gap-1 border-t pt-1">
                      <Star className="h-3 w-3 fill-current" />
                      <span>Level {inspectedCard.level}</span>
                    </div>
                  )}
                </div>
              )}

            <div className="bg-dark-surface-elevated/20 border-border-dim/40 max-h-40 overflow-y-auto rounded-xl border p-3 pr-1 font-sans text-[11px] leading-relaxed font-light whitespace-pre-line text-slate-400">
              {inspectedCard.description || "No card details available."}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-1 flex-col items-center justify-center p-6 text-center text-slate-500">
          <Eye className="mb-2 h-8 w-8 text-slate-700" />
          <p className="text-xs font-semibold tracking-wider uppercase">No Card Inspected</p>
          <p className="mt-1 max-w-45 text-[11px] text-slate-600">
            Hover over a card or click its detail icon to view descriptions.
          </p>
        </div>
      )}
    </div>
  );
}

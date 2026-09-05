import { Minus, Plus, Trash2 } from "lucide-react";

import Button from "../../../components/ui/Button";
import { API_BASE_URL } from "../../../config/env";
import { getCardTheme } from "../../../features/cards/utils/cardTheme";
import type { EditorCardListItemProps } from "./EditorCardListItem";

/**
 * EditorCardGridItem renders a single card entry in the deck editor sections in grid format.
 * Provides increment, decrement, and removal overlay controls on hover.
 * Matches the prop contract of {@link EditorCardListItem}.
 *
 * @param props - The component props.
 * @returns The rendered EditorCardGridItem component.
 */
export default function EditorCardGridItem({
  cardId,
  name,
  type,
  imageUrl,
  section,
  quantity,
  updateQty,
  remove,
}: EditorCardListItemProps) {
  const { deckBadgeColor: badgeColor } = getCardTheme(type);

  return (
    <div className="bg-dark-surface-elevated/40 border-border-dim/60 hover:border-cyan-accent/50 group relative flex min-h-32 flex-col overflow-hidden rounded-xl border p-2 text-center backdrop-blur-sm transition-all duration-200 hover:shadow-md">
      <div className="border-border-dim/40 relative mx-auto flex aspect-4/5 w-full items-center justify-center overflow-hidden rounded bg-slate-900">
        {imageUrl ? (
          <img
            src={`${API_BASE_URL}/api/${imageUrl}`}
            alt={name}
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="text-4xs font-bold text-slate-600 uppercase">YuGi</span>
        )}

        <span className="text-3xs absolute right-1 bottom-1 rounded border border-white/10 bg-slate-950 px-1.5 py-0.5 font-mono font-bold text-white shadow-sm select-none">
          x{quantity}
        </span>
      </div>

      <div className="mt-1.5 flex flex-1 flex-col justify-between">
        <h4 className="group-hover:text-cyan-accent text-3xs line-clamp-1 font-bold text-white transition-colors">
          {name}
        </h4>
        {type && (
          <span
            className={`text-5xs mx-auto mt-0.5 rounded border px-1 font-semibold tracking-wider uppercase select-none ${badgeColor}`}
          >
            {type.replace(" Card", "").replace(" Monster", "")}
          </span>
        )}
      </div>

      {/* Hover Action Overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-slate-950/85 p-2 opacity-0 backdrop-blur-xs transition-opacity duration-200 group-hover:opacity-100">
        <h4 className="text-3xs mb-1 line-clamp-1 font-bold text-white">{name}</h4>
        <div className="border-border-dim/80 flex items-center gap-1.5 rounded-lg border bg-slate-950 p-0.5">
          <button
            type="button"
            onClick={() => updateQty(cardId, section, -1)}
            className="hover:bg-dark-surface-elevated/80 hover:text-cyan-accent flex h-6 w-6 cursor-pointer items-center justify-center rounded text-slate-400 transition-colors disabled:cursor-not-allowed disabled:opacity-20"
            title="Decrease Quantity"
          >
            <Minus className="h-3 w-3" />
          </button>
          <span className="text-2xs min-w-4 text-center font-mono font-bold text-white select-none">
            {quantity}
          </span>
          <button
            type="button"
            onClick={() => updateQty(cardId, section, 1)}
            disabled={quantity >= 3}
            className="hover:bg-dark-surface-elevated/80 hover:text-cyan-accent flex h-6 w-6 cursor-pointer items-center justify-center rounded text-slate-400 transition-colors disabled:cursor-not-allowed disabled:opacity-20"
            title="Increase Quantity"
          >
            <Plus className="h-3 w-3" />
          </button>
        </div>

        <Button
          type="button"
          variant="outline-red"
          size="sm"
          onClick={() => remove(cardId, section)}
          className="text-4xs mt-1 flex h-6 w-full items-center justify-center gap-1 rounded py-0.5 font-bold transition-all"
          title="Remove Card"
        >
          <Trash2 className="h-3 w-3" />
          <span>Remove</span>
        </Button>
      </div>
    </div>
  );
}

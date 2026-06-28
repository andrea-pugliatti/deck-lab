import { Minus, Plus, Trash2 } from "lucide-react";

import type { CardSection } from "../../types";
import { getCardTheme } from "../../utils/card";
import Badge from "../ui/Badge";
import Button from "../ui/Button";

export interface EditorCardItemProps {
  cardId: number;
  name: string;
  type?: string;
  imageUrl?: string;
  section: CardSection;
  quantity: number;
  updateQty: (cardId: number, section: CardSection, delta: number) => void;
  remove: (cardId: number, section: CardSection) => void;
}

export default function EditorCardItem({
  cardId,
  name,
  type,
  imageUrl,
  section,
  quantity,
  updateQty,
  remove,
}: EditorCardItemProps) {
  const { badgeVariant } = getCardTheme(type);

  const containerClass =
    "flex bg-dark-surface-elevated/40 border border-border-dim rounded-xl items-center justify-between gap-3 group p-2";

  const imgWrapperClass =
    "shrink-0 bg-slate-900 rounded overflow-hidden flex items-center justify-center border border-border-dim/40 w-10 h-13";

  const titleClass = "text-xs font-bold text-white line-clamp-1";

  return (
    <div className={containerClass}>
      <div className="flex min-w-0 items-center gap-2.5">
        <div className={imgWrapperClass}>
          {imageUrl ? (
            <img src={`/api/${imageUrl}`} alt={name} className="h-full w-full object-cover" />
          ) : (
            <span className="text-[7px] font-bold text-slate-600 uppercase">YuGi</span>
          )}
        </div>
        <div className="min-w-0">
          <h4 className={titleClass}>{name}</h4>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            {type && (
              <Badge variant={badgeVariant} className="py-0.2 px-1.5 text-[8px] select-none">
                {type.replace(" Card", "").replace(" Monster", "")}
              </Badge>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="border-border-dim/80 flex items-center rounded-lg border bg-slate-950 p-0.5">
          <button
            type="button"
            onClick={() => updateQty(cardId, section, -1)}
            className="hover:bg-dark-surface-elevated/80 hover:text-cyan-accent flex h-6 w-6 cursor-pointer items-center justify-center rounded text-slate-400 transition-colors disabled:cursor-not-allowed disabled:opacity-20"
            title="Decrease Quantity"
          >
            <Minus className="h-3.5 w-3.5" />
          </button>
          <span className="min-w-6 px-2 text-center font-mono text-xs font-bold text-white select-none">
            {quantity}
          </span>
          <button
            type="button"
            onClick={() => updateQty(cardId, section, 1)}
            disabled={quantity >= 3}
            className="hover:bg-dark-surface-elevated/80 hover:text-cyan-accent flex h-6 w-6 cursor-pointer items-center justify-center rounded text-slate-400 transition-colors disabled:cursor-not-allowed disabled:opacity-20"
            title="Increase Quantity"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
        </div>

        <Button
          type="button"
          variant="outline-red"
          size="sm"
          onClick={() => remove(cardId, section)}
          className="min-w-0 rounded-lg p-1.5 transition-all"
          title="Remove Card"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}

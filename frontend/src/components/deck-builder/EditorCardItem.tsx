import { Minus, Plus, Trash2 } from "lucide-react";
import Badge from "../ui/Badge";
import Button from "../ui/Button";

export interface EditorCardItemProps {
  cardId: number;
  name: string;
  type?: string;
  imageUrl?: string;
  section: "MAIN" | "EXTRA" | "SIDE";
  quantity: number;
  updateQty: (cardId: number, section: "MAIN" | "EXTRA" | "SIDE", delta: number) => void;
  remove: (cardId: number, section: "MAIN" | "EXTRA" | "SIDE") => void;
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
  let badgeVariant: "default" | "spell" | "trap" | "monster" = "default";
  if (type?.toLowerCase().includes("spell")) badgeVariant = "spell";
  else if (type?.toLowerCase().includes("trap")) badgeVariant = "trap";
  else if (type?.toLowerCase().includes("monster")) badgeVariant = "monster";

  const containerClass =
    "flex bg-dark-surface-elevated/40 border border-border-dim rounded-xl items-center justify-between gap-3 group p-2";

  const imgWrapperClass =
    "shrink-0 bg-slate-900 rounded overflow-hidden flex items-center justify-center border border-border-dim/40 w-10 h-13";

  const titleClass = "text-xs font-bold text-white line-clamp-1";

  return (
    <div className={containerClass}>
      <div className="flex items-center gap-2.5 min-w-0">
        <div className={imgWrapperClass}>
          {imageUrl ? (
            <img src={`/api/${imageUrl}`} alt={name} className="w-full h-full object-cover" />
          ) : (
            <span className="font-bold uppercase text-slate-600 text-[7px]">YuGi</span>
          )}
        </div>
        <div className="min-w-0">
          <h4 className={titleClass}>{name}</h4>
          <div className="flex gap-2 items-center mt-1 flex-wrap">
            {type && (
              <Badge variant={badgeVariant} className="text-[8px] px-1.5 py-0.2 select-none">
                {type.replace(" Card", "").replace(" Monster", "")}
              </Badge>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center bg-slate-950 border border-border-dim/80 rounded-lg p-0.5">
          <button
            type="button"
            onClick={() => updateQty(cardId, section, -1)}
            className="w-6 h-6 flex items-center justify-center rounded hover:bg-dark-surface-elevated/80 text-slate-400 hover:text-cyan-accent transition-colors cursor-pointer disabled:opacity-20 disabled:cursor-not-allowed"
            title="Decrease Quantity"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <span className="text-xs font-mono font-bold text-white px-2 min-w-6 text-center select-none">
            {quantity}
          </span>
          <button
            type="button"
            onClick={() => updateQty(cardId, section, 1)}
            disabled={quantity >= 3}
            className="w-6 h-6 flex items-center justify-center rounded hover:bg-dark-surface-elevated/80 text-slate-400 hover:text-cyan-accent transition-colors cursor-pointer disabled:opacity-20 disabled:cursor-not-allowed"
            title="Increase Quantity"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        <Button
          type="button"
          variant="outline-red"
          size="sm"
          onClick={() => remove(cardId, section)}
          className="p-1.5 min-w-0 rounded-lg transition-all"
          title="Remove Card"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </Button>
      </div>
    </div>
  );
}

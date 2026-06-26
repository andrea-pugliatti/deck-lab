import { Plus } from "lucide-react";
import { useState } from "react";
import type { DeckCardItem, Suggestion } from "../../types";
import Badge from "../ui/Badge";
import Button from "../ui/Button";

export interface AiSuggestionItemProps {
  card: Suggestion;
  deckCards: DeckCardItem[];
  onAdd: (card: Suggestion) => void;
}

export default function AiSuggestionItem({ card, deckCards, onAdd }: AiSuggestionItemProps) {
  const [imgError, setImgError] = useState(false);
  const countInDeck = deckCards
    .filter((c) => c.cardId === card.cardId)
    .reduce((sum, c) => sum + c.quantity, 0);

  const isMaxCopies = countInDeck >= 3;

  return (
    <div className="flex items-center gap-3 p-3 bg-dark-surface-elevated/40 hover:bg-dark-surface-elevated/70 border border-border-dim/40 hover:border-border-dim rounded-xl">
      {card.imageUrl && !imgError ? (
        <img
          src={card.imageUrl.startsWith("/") ? `/api${card.imageUrl}` : `/api/${card.imageUrl}`}
          alt={card.name}
          className="w-10 h-10 object-cover rounded-lg border border-border-dim shrink-0 shadow-inner"
          onError={() => setImgError(true)}
        />
      ) : (
        <div className="w-10 h-10 bg-slate-900 rounded-lg overflow-hidden flex items-center justify-center border border-border-dim/40 shrink-0">
          <span className="font-bold text-slate-600 text-[10px] select-none">:)</span>
        </div>
      )}

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs font-bold text-slate-200 truncate">{card.name}</span>
          <Badge
            variant={
              card.section === "EXTRA" ? "purple" : card.section === "SIDE" ? "gold" : "cyan"
            }
          >
            {card.section}
          </Badge>
        </div>
        <p className="text-[10px] text-slate-400 mt-1 leading-normal">{card.synergyReason}</p>
      </div>

      <Button
        type="button"
        variant="outline"
        onClick={() => onAdd(card)}
        disabled={isMaxCopies}
        className={`w-7 h-7 p-0! shrink-0 flex items-center justify-center rounded-lg
          ${
            isMaxCopies
              ? "border-border-dim bg-dark-surface-elevated text-slate-500 opacity-40 cursor-not-allowed"
              : "border-cyan-accent/30 hover:border-cyan-accent text-cyan-accent bg-cyan-950/10 hover:bg-cyan-950/30"
          }
        `}
        title={isMaxCopies ? "Max copies added" : `Add to ${card.section} Deck`}
      >
        <Plus className="w-4 h-4" />
      </Button>
    </div>
  );
}

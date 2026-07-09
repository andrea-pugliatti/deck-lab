import { Plus } from "lucide-react";
import { useState } from "react";

import { getFormatRules } from "../../reducers/deckReducer";
import type { DeckCardItem, Suggestion } from "../../types";
import Badge from "../ui/Badge";
import Button from "../ui/Button";

/**
 * Properties for the {@link AiSuggestionItem} component.
 */
export interface AiSuggestionItemProps {
  card: Suggestion;
  deckCards: DeckCardItem[];
  formatName: string;
  onAdd: (card: Suggestion) => void;
}

/**
 * AiSuggestionItem component displays an individual AI-recommended card.
 * It shows the card's name, type section, synergy reason, artwork, and current quantity count,
 * with an "Add" button that is disabled if the user has reached the maximum permitted copies.
 *
 * @param props - The component properties.
 * @returns The rendered AI suggestion item.
 */
export default function AiSuggestionItem({
  card,
  deckCards,
  formatName,
  onAdd,
}: AiSuggestionItemProps) {
  const [imgError, setImgError] = useState(false);
  const countInDeck = deckCards
    .filter((c) => c.cardId === card.cardId)
    .reduce((sum, c) => sum + c.quantity, 0);

  const rules = getFormatRules(formatName);
  const isMaxCopies = countInDeck >= rules.maxCopiesPerCard;
  const apiBaseUrl = import.meta.env.VITE_API_URL || "";

  return (
    <div className="bg-dark-surface-elevated/40 hover:bg-dark-surface-elevated/70 border-border-dim/40 hover:border-border-dim flex items-center gap-3 rounded-xl border p-3">
      {card.imageUrl && !imgError ? (
        <img
          src={card.imageUrl.startsWith("/") ? `${apiBaseUrl}/api${card.imageUrl}` : `${apiBaseUrl}/api/${card.imageUrl}`}
          alt={card.name}
          className="border-border-dim h-10 w-10 shrink-0 rounded-lg border object-cover shadow-inner"
          onError={() => setImgError(true)}
        />
      ) : (
        <div className="border-border-dim/40 flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg border bg-slate-900">
          <span className="text-[10px] font-bold text-slate-600 select-none">:)</span>
        </div>
      )}

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="truncate text-xs font-bold text-slate-200">{card.name}</span>
          <Badge
            variant={
              card.section === "EXTRA" ? "purple" : card.section === "SIDE" ? "gold" : "cyan"
            }
          >
            {card.section}
          </Badge>
        </div>
        <p className="mt-1 text-[10px] leading-normal text-slate-400">{card.synergyReason}</p>
      </div>

      <Button
        type="button"
        variant="outline"
        onClick={() => onAdd(card)}
        disabled={isMaxCopies}
        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg p-0! ${
          isMaxCopies
            ? "border-border-dim bg-dark-surface-elevated cursor-not-allowed text-slate-500 opacity-40"
            : "border-cyan-accent/30 hover:border-cyan-accent text-cyan-accent bg-cyan-950/10 hover:bg-cyan-950/30"
        } `}
        title={isMaxCopies ? "Max copies added" : `Add to ${card.section} Deck`}
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
}

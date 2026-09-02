import { Plus } from "lucide-react";
import { useState } from "react";

import Badge from "../../../components/ui/Badge";
import { API_BASE_URL } from "../../../config/env";
import { getFormatRules } from "../../../features/deck-builder/reducers/deckReducer";
import type { DeckCardItem, Format, Suggestion } from "../../../types";

/**
 * Properties for the {@link AiSuggestionItem} component.
 */
export interface AiSuggestionItemProps {
  card: Suggestion;
  deckCards: DeckCardItem[];
  formatName: Format;
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

  return (
    <div className="bg-dark-surface-elevated/40 hover:bg-dark-surface-elevated/70 border-border-dim/40 hover:border-border-dim flex items-center gap-3 rounded-xl border p-3">
      {card.imageUrl && !imgError ? (
        <img
          src={
            card.imageUrl.startsWith("/")
              ? `${API_BASE_URL}/api${card.imageUrl}`
              : `${API_BASE_URL}/api/${card.imageUrl}`
          }
          alt={card.name}
          className="border-border-dim h-10 w-10 shrink-0 rounded-lg border object-cover shadow-inner"
          onError={() => setImgError(true)}
        />
      ) : (
        <div className="border-border-dim/40 flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg border bg-slate-900">
          <span className="text-2xs font-bold text-slate-600 select-none">:)</span>
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
        <p className="text-2xs mt-1 leading-normal text-slate-400">{card.synergyReason}</p>
      </div>

      <button
        type="button"
        onClick={() => onAdd(card)}
        disabled={isMaxCopies}
        className={`focus-visible:ring-cyan-accent flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border transition-all duration-200 select-none focus:outline-none focus-visible:ring-2 ${
          isMaxCopies
            ? "border-border-dim bg-dark-surface-elevated cursor-not-allowed text-slate-500 opacity-40"
            : "border-cyan-accent/30 hover:border-cyan-accent text-cyan-accent cursor-pointer bg-cyan-950/10 hover:bg-cyan-950/30"
        }`}
        title={isMaxCopies ? "Max copies added" : `Add to ${card.section} Deck`}
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
}

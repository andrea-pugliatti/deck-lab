import type { Card, CardSection, DeckCardItem } from "../../types";
import { getCardTheme } from "../../utils/card";
import Badge from "../ui/Badge";
import Button from "../ui/Button";

/**
 * Props for the {@link SearchCardListItem} component.
 */
export interface SearchCardListItemProps {
  cardId: number;
  name: string;
  type?: string;
  imageUrl?: string;
  card: Card;
  deckCards: DeckCardItem[];
  addCard: (card: Card, section: CardSection) => void;
}

/**
 * SearchCardListItem renders a card search result item in a horizontal list view,
 * enabling quick additions to the Main, Extra, or Side decks.
 *
 * @param props - The component props.
 * @returns The rendered SearchCardListItem component.
 */
export default function SearchCardListItem({
  cardId,
  name,
  type,
  imageUrl,
  card,
  deckCards = [],
  addCard,
}: SearchCardListItemProps) {
  const { badgeVariant } = getCardTheme(type);

  const containerClass =
    "flex bg-dark-surface-elevated/40 border border-border-dim rounded-xl items-center justify-between gap-3 group p-2.5 hover:border-border-glow transition-all duration-200";

  const imgWrapperClass =
    "shrink-0 bg-slate-900 rounded overflow-hidden flex items-center justify-center border border-border-dim/40 w-12 h-16";

  const titleClass =
    "text-xs font-bold text-white line-clamp-1 group-hover:text-cyan-accent transition-colors";

  const isExtraDeckCardType = (cardType?: string) => {
    if (!cardType) return false;
    const t = cardType.toLowerCase();
    return t.includes("fusion") || t.includes("synchro") || t.includes("xyz") || t.includes("link");
  };

  const isExtra = isExtraDeckCardType(type);
  const totalInDeck = deckCards
    .filter((dc) => dc.cardId === cardId)
    .reduce((sum, dc) => sum + dc.quantity, 0);
  const apiBaseUrl = import.meta.env.VITE_API_URL || "";

  return (
    <div className={containerClass}>
      <div className="flex min-w-0 items-center gap-2.5">
        <div className={imgWrapperClass}>
          {imageUrl ? (
            <img src={`${apiBaseUrl}/api/${imageUrl}`} alt={name} className="h-full w-full object-cover" />
          ) : (
            <span className="text-[8px] font-bold text-slate-600 uppercase">YuGi</span>
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
            {totalInDeck > 0 && (
              <Badge variant="gold" className="py-0.2 px-1.5 font-mono text-[8px]">
                {totalInDeck} added
              </Badge>
            )}
          </div>
        </div>
      </div>

      <div className="flex shrink-0 flex-wrap justify-end gap-1">
        <Button
          type="button"
          variant="outline-cyan"
          size="sm"
          onClick={() => addCard(card, "MAIN")}
          disabled={isExtra || totalInDeck >= 3}
          className="rounded px-2 py-1 text-[9px] font-bold transition-all"
          title={isExtra ? "Extra deck monsters cannot go in the Main Deck" : "Add to Main"}
        >
          + Main
        </Button>
        <Button
          type="button"
          variant="outline-gold"
          size="sm"
          onClick={() => addCard(card, "EXTRA")}
          disabled={!isExtra || totalInDeck >= 3}
          className="rounded px-2 py-1 text-[9px] font-bold transition-all"
          title={!isExtra ? "Main deck cards cannot go in the Extra Deck" : "Add to Extra"}
        >
          + Extra
        </Button>
        <Button
          type="button"
          variant="outline-purple"
          size="sm"
          onClick={() => addCard(card, "SIDE")}
          disabled={totalInDeck >= 3}
          className="rounded px-2 py-1 text-[9px] font-bold transition-all"
          title="Add to Side"
        >
          + Side
        </Button>
      </div>
    </div>
  );
}

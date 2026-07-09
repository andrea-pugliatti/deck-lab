import { getCardTheme } from "../../utils/card";
import Badge from "../ui/Badge";
import Button from "../ui/Button";
import type { SearchCardListItemProps } from "./SearchCardListItem";

/**
 * SearchCardGridItem renders a card search result item in a compact grid format.
 * Provides overlay controls on hover or inline, optimized for dense grid scanning.
 * Matches the prop contract of {@link SearchCardListItem}.
 *
 * @param props - The component properties.
 * @returns The rendered SearchCardGridItem component.
 */
export default function SearchCardGridItem({
  cardId,
  name,
  type,
  imageUrl,
  card,
  deckCards = [],
  addCard,
}: SearchCardListItemProps) {
  const { deckBadgeColor: badgeColor } = getCardTheme(type);

  const isExtraDeckCardType = (cardType?: string) => {
    if (!cardType) return false;
    const t = cardType.toLowerCase();
    return t.includes("fusion") || t.includes("synchro") || t.includes("xyz") || t.includes("link");
  };

  const isExtra = isExtraDeckCardType(type);
  const totalInDeck = deckCards
    .filter((dc) => dc.cardId === cardId)
    .reduce((sum, dc) => sum + dc.quantity, 0);

  return (
    <div className="bg-dark-surface-elevated/40 border-border-dim/60 hover:border-cyan-accent/50 group relative flex min-h-36 flex-col overflow-hidden rounded-xl border p-2 text-center backdrop-blur-sm transition-all duration-200 hover:shadow-md">
      <div className="border-border-dim/40 relative mx-auto flex aspect-4/5 w-full items-center justify-center overflow-hidden rounded bg-slate-900">
        {imageUrl ? (
          <img
            src={`/api/${imageUrl}`}
            alt={name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <span className="text-[8px] font-bold text-slate-600 uppercase">YuGi</span>
        )}

        {totalInDeck > 0 && (
          <Badge
            variant="gold"
            className="absolute top-1 right-1 px-1 py-0 font-mono text-[7px] select-none"
          >
            {totalInDeck} added
          </Badge>
        )}
      </div>

      <div className="mt-1.5 flex flex-1 flex-col justify-between">
        <h4 className="group-hover:text-cyan-accent line-clamp-1 text-[10px] font-bold text-white transition-colors">
          {name}
        </h4>
        {type && (
          <span
            className={`mx-auto mt-0.5 rounded border px-1 text-[7px] font-semibold tracking-wider uppercase select-none ${badgeColor}`}
          >
            {type.replace(" Card", "").replace(" Monster", "")}
          </span>
        )}
      </div>

      {/* Hover Action Overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 bg-slate-950/80 p-2 opacity-0 backdrop-blur-xs transition-opacity duration-200 group-hover:opacity-100">
        <h4 className="mb-1 line-clamp-1 px-1 text-[10px] font-bold text-white">{name}</h4>
        <Button
          type="button"
          variant="outline-cyan"
          size="sm"
          onClick={() => addCard(card, "MAIN")}
          disabled={isExtra || totalInDeck >= 3}
          className="h-6 w-full rounded py-0.5 text-[8px] font-bold transition-all"
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
          className="h-6 w-full rounded py-0.5 text-[8px] font-bold transition-all"
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
          className="h-6 w-full rounded py-0.5 text-[8px] font-bold transition-all"
          title="Add to Side"
        >
          + Side
        </Button>
      </div>
    </div>
  );
}

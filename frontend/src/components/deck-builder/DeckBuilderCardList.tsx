import type { Card, CardSection, DeckCardItem } from "../../types";
import LoadingSpinner from "../LoadingSpinner";
import SearchCardGridItem from "./SearchCardGridItem";
import SearchCardListItem from "./SearchCardListItem";

/**
 * Properties for the {@link DeckBuilderCardList} component.
 */
export interface DeckBuilderCardListProps {
  libraryLoading: boolean;
  libraryCards: Card[];
  deckCards: DeckCardItem[];
  addCard: (card: Card, section: CardSection) => void;
  viewMode?: "grid" | "list";
}

/**
 * DeckBuilderCardList component renders the scrollable list of card search results
 * within the deck builder. It handles loading spinner states, empty search results,
 * and renders individual catalog card elements as list or grid items.
 *
 * @param props - The component properties.
 * @returns The rendered deck builder card list.
 */
export default function DeckBuilderCardList({
  libraryLoading,
  libraryCards,
  deckCards,
  addCard,
  viewMode = "list",
}: DeckBuilderCardListProps) {
  if (libraryLoading && libraryCards.length === 0) {
    return <LoadingSpinner size="sm" className="py-16" />;
  }

  if (libraryCards.length === 0) {
    return (
      <div className="py-16 text-center text-xs text-slate-500">
        No cards match search criteria.
      </div>
    );
  }

  return (
    <div
      className={`transition-opacity duration-200 ${
        libraryLoading ? "pointer-events-none opacity-50" : "opacity-100"
      }`}
    >
      {viewMode === "grid" ? (
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
          {libraryCards.map((card) => (
            <SearchCardGridItem
              key={card.id}
              cardId={card.id}
              name={card.name}
              type={card.type}
              imageUrl={card.imageUrlCropped}
              card={card}
              deckCards={deckCards}
              addCard={addCard}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-2.5">
          {libraryCards.map((card) => (
            <SearchCardListItem
              key={card.id}
              cardId={card.id}
              name={card.name}
              type={card.type}
              imageUrl={card.imageUrlCropped}
              card={card}
              deckCards={deckCards}
              addCard={addCard}
            />
          ))}
        </div>
      )}
    </div>
  );
}

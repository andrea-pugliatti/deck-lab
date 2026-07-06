import type { Card, CardSection, DeckCardItem } from "../../types";
import LoadingSpinner from "../LoadingSpinner";
import SearchCardItem from "./SearchCardItem";

/**
 * Properties for the {@link DeckBuilderCardList} component.
 */
export interface DeckBuilderCardListProps {
  libraryLoading: boolean;
  libraryCards: Card[];
  deckCards: DeckCardItem[];
  addCard: (card: Card, section: CardSection) => void;
}

/**
 * DeckBuilderCardList component renders the scrollable list of card search results
 * within the deck builder. It handles loading spinner states, empty search results,
 * and renders individual {@link SearchCardItem} elements for each card.
 *
 * @param props - The component properties.
 * @returns The rendered deck builder card list.
 */
export default function DeckBuilderCardList({
  libraryLoading,
  libraryCards,
  deckCards,
  addCard,
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
      className={`space-y-3 transition-opacity duration-200 ${
        libraryLoading ? "pointer-events-none opacity-50" : "opacity-100"
      }`}
    >
      {libraryCards.map((card) => (
        <SearchCardItem
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
  );
}

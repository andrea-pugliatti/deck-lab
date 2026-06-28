import type { Card, CardSection, DeckCardItem } from "../../types";
import LoadingSpinner from "../LoadingSpinner";
import SearchCardItem from "./SearchCardItem";

export interface DeckBuilderCardListProps {
  libraryLoading: boolean;
  libraryCards: Card[];
  deckCards: DeckCardItem[];
  addCard: (card: Card, section: CardSection) => void;
}

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

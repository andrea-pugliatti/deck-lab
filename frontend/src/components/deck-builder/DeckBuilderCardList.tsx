import { useDeckBuilder } from "../../context/DeckBuilderContext";
import LoadingSpinner from "../LoadingSpinner";
import SearchCardItem from "./SearchCardItem";

export default function DeckBuilderCardList() {
  const { libraryLoading, libraryCards, deckCards, addCard } = useDeckBuilder();

  if (libraryLoading) {
    return <LoadingSpinner size="sm" className="py-16" />;
  }

  if (libraryCards.length === 0) {
    return (
      <div className="text-center py-16 text-slate-500 text-xs">
        No cards match search criteria.
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto pr-1 space-y-3 min-h-0">
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

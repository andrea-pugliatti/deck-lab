import { useDeckBuilder } from "../../context/DeckBuilderContext";
import type { CardSection } from "../../types";
import EditorCardItem from "./EditorCardItem";

export interface DeckSectionListProps {
  section: CardSection;
}

export default function DeckSectionList({ section }: DeckSectionListProps) {
  const { deckCards, updateQuantity, removeCard } = useDeckBuilder();

  const cards = deckCards.filter((c) => c.section === section);
  const count = cards.reduce((acc, c) => acc + c.quantity, 0);

  let title = "Main Deck";
  let colorClass = "bg-cyan-accent";
  let limitText = `${count} / 60 Cards (Min 40)`;
  let limitClass =
    count >= 40 && count <= 60
      ? "bg-cyan-accent/10 text-cyan-accent"
      : "bg-amber-500/10 text-amber-400";
  let emptyMessage = "Empty Main Deck. Add cards using the catalog search.";

  if (section === "EXTRA") {
    title = "Extra Deck";
    colorClass = "bg-gold-accent";
    limitText = `${count} / 15 Cards (Max 15)`;
    limitClass = count <= 15 ? "bg-gold-accent/10 text-gold-accent" : "bg-red-500/10 text-red-400";
    emptyMessage = "Empty Extra Deck. Extra Deck monsters (Fusion/Synchro/Xyz/Link) will go here.";
  } else if (section === "SIDE") {
    title = "Side Deck";
    colorClass = "bg-purple-400";
    limitText = `${count} / 15 Cards (Max 15)`;
    limitClass = count <= 15 ? "bg-purple-400/10 text-purple-400" : "bg-red-500/10 text-red-400";
    emptyMessage = "Empty Side Deck. Add swap options for tournament settings.";
  }

  return (
    <div className="bg-dark-surface border border-border-dim rounded-2xl p-5 shadow-md">
      <div className="flex justify-between items-center mb-4 pb-2 border-b border-border-dim/60">
        <span className="font-display text-sm font-bold text-white flex items-center gap-2">
          <span className={`w-2.5 h-2.5 rounded-full ${colorClass}`}></span>
          {title}
        </span>
        <span className={`text-xs font-semibold px-2 py-0.5 rounded ${limitClass}`}>
          {limitText}
        </span>
      </div>

      {cards.length > 0 ? (
        <div className="space-y-2">
          {cards.map((c) => (
            <EditorCardItem
              key={c.cardId}
              cardId={c.cardId}
              name={c.name}
              type={c.type}
              imageUrl={c.imageUrl}
              section={section}
              quantity={c.quantity}
              updateQty={updateQuantity}
              remove={removeCard}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-6 border border-dashed border-border-dim rounded-xl text-slate-500 text-xs">
          {emptyMessage}
        </div>
      )}
    </div>
  );
}

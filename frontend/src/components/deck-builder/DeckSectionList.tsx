import { getFormatRules } from "../../services/validation";
import type { CardSection, DeckCardItem } from "../../types";
import Badge from "../ui/Badge";
import EditorCardItem from "./EditorCardItem";

export interface DeckSectionListProps {
  section: CardSection;
  deckCards: DeckCardItem[];
  formatName: string;
  updateQuantity: (cardId: number, section: CardSection, delta: number) => void;
  removeCard: (cardId: number, section: CardSection) => void;
}

export default function DeckSectionList({
  section,
  deckCards,
  formatName,
  updateQuantity,
  removeCard,
}: DeckSectionListProps) {
  const cards = deckCards.filter((c) => c.section === section);
  const count = cards.reduce((acc, c) => acc + c.quantity, 0);

  const rules = getFormatRules(formatName);

  let title = "Main Deck";
  let colorClass = "bg-cyan-accent";
  let limitText = `${count} / ${rules.maxMainSize} Cards (Min ${rules.minMainSize})`;
  let badgeVariant: "cyan" | "monster" | "gold" | "trap" | "purple" =
    count >= rules.minMainSize && count <= rules.maxMainSize ? "cyan" : "monster";
  let emptyMessage = "Empty Main Deck. Add cards using the catalog search.";

  if (section === "EXTRA") {
    title = "Extra Deck";
    colorClass = "bg-gold-accent";
    limitText = `${count} / ${rules.maxExtraSize} Cards (Max ${rules.maxExtraSize})`;
    badgeVariant = count <= rules.maxExtraSize ? "gold" : "trap";
    emptyMessage = "Empty Extra Deck. Extra Deck monsters (Fusion/Synchro/Xyz/Link) will go here.";
  } else if (section === "SIDE") {
    title = "Side Deck";
    colorClass = "bg-purple-400";
    limitText = `${count} / ${rules.maxSideSize} Cards (Max ${rules.maxSideSize})`;
    badgeVariant = count <= rules.maxSideSize ? "purple" : "trap";
    emptyMessage = "Empty Side Deck. Add swap options for tournament settings.";
  }

  return (
    <div className="bg-dark-surface border-border-dim rounded-2xl border p-5 shadow-md">
      <div className="border-border-dim/60 mb-4 flex items-center justify-between border-b pb-2">
        <span className="font-display flex items-center gap-2 text-sm font-bold text-white">
          <span className={`h-2.5 w-2.5 rounded-full ${colorClass}`}></span>
          {title}
        </span>
        <Badge variant={badgeVariant} className="text-xs font-semibold normal-case">
          {limitText}
        </Badge>
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
        <div className="border-border-dim rounded-xl border border-dashed py-6 text-center text-xs text-slate-500">
          {emptyMessage}
        </div>
      )}
    </div>
  );
}

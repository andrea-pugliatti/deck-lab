import { Link } from "react-router";

import Badge from "../../../components/ui/Badge";
import CardImage from "../../../components/ui/CardImage";
import { getCardKind } from "../../../features/cards/utils/cardKind";

/**
 * Properties for the {@link DeckGridItem} component.
 */
export interface DeckGridItemProps {
  cardId: number;
  name: string;
  type?: string;
  imageUrl?: string;
  quantity: number;
}

/**
 * DeckGridItem component displays an individual card representation inside a deck list.
 * It showcases the card image, quantity, name, and themed type badge, with a link to the card's details.
 *
 * @param props - The component properties.
 * @returns The rendered deck grid item.
 */
export default function DeckGridItem({
  cardId,
  name,
  type,
  imageUrl,
  quantity,
}: DeckGridItemProps) {
  return (
    <Link
      to={`/cards/${cardId}`}
      viewTransition
      className="group bg-dark-surface-elevated/40 hover:bg-dark-surface-elevated border-border-dim hover:border-border-glow relative flex flex-col overflow-hidden rounded-xl border no-underline transition-all duration-200 hover:shadow-md"
    >
      <div className="border-border-dim/40 relative flex aspect-video w-full items-center justify-center overflow-hidden border-b bg-slate-900">
        <CardImage src={imageUrl} alt={name} />
        <span className="text-2xs absolute right-1 bottom-1 rounded border border-white/10 bg-slate-900/85 px-1.5 py-0.5 font-mono font-bold text-white shadow-xs">
          x{quantity}
        </span>
      </div>

      <div className="flex flex-1 flex-col justify-between p-3">
        <h4 className="group-hover:text-cyan-accent mb-1 line-clamp-1 font-sans text-xs font-bold text-white transition-colors duration-150">
          {name}
        </h4>
        {type && (
          <Badge variant={getCardKind(type)} className="self-start px-1 py-0.5">
            {type.replace(" Monster", "").replace(" Card", "")}
          </Badge>
        )}
      </div>
    </Link>
  );
}

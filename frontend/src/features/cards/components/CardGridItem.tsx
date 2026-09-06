import { Flame, Shield, Star } from "lucide-react";
import { Link } from "react-router";

import Badge from "../../../components/ui/Badge";
import CardImage from "../../../components/ui/CardImage";
import { getCardKind } from "../../../features/cards/utils/cardKind";
import { usePrefetchCard } from "../../../hooks/usePrefetch";
import type { Card } from "../../../types";

/**
 * CardGridItem component renders a preview card representation in a grid layout.
 * It displays the card's cropped artwork, type, attribute, name, description, and monster-specific
 * statistics (like level, ATK, and DEF) with a view transition link to details.
 *
 * @param props - The card details based on {@link Card} type.
 * @returns The rendered grid item.
 */
export default function CardGridItem({
  id,
  name,
  type,
  description,
  attribute,
  atk,
  def,
  level,
  imageUrlCropped,
}: Card) {
  const cardKind = getCardKind(type);
  const isMonster = cardKind === "monster";
  const handlePrefetch = usePrefetchCard(id);

  return (
    <Link
      to={`/cards/${id}`}
      viewTransition
      onMouseEnter={handlePrefetch}
      onFocus={handlePrefetch}
      className="deck-card-base hover-hologram group flex flex-col justify-between"
    >
      <div className="bg-dark-surface-elevated border-border-dim relative flex aspect-video items-center justify-center overflow-hidden border-b">
        <CardImage src={imageUrlCropped} alt={name} />
        {attribute && (
          <span className="text-3xs absolute top-2 right-2 rounded border border-white/10 bg-slate-900/60 px-1.5 py-0.5 font-bold text-white uppercase">
            {attribute}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col justify-between p-4">
        <div className="mb-4">
          <div className="mb-1 flex items-center justify-between gap-2">
            <Badge variant={cardKind} className="px-1.5 py-0.5">
              {type}
            </Badge>
            {isMonster && level && (
              <div className="text-gold-accent flex items-center gap-0.5">
                <Star className="size-3.5 fill-current" aria-hidden="true" />
                <span className="text-xs font-bold">{level}</span>
              </div>
            )}
          </div>
          <h3 className="font-display group-hover:text-cyan-accent mb-1 line-clamp-1 text-base font-bold text-white transition-colors duration-200">
            {name}
          </h3>
          <p className="line-clamp-2 text-xs leading-relaxed text-slate-400">{description}</p>
        </div>

        {isMonster && (atk !== undefined || def !== undefined) && (
          <div className="bg-dark-surface-elevated/40 border-border-dim/50 mt-auto flex items-center justify-between rounded border px-2.5 py-1.5 text-xs font-semibold text-slate-300">
            <div className="flex items-center gap-1">
              <Flame className="size-3.5 text-amber-500" aria-hidden="true" />
              <span>ATK: {atk === -1 ? "?" : atk}</span>
            </div>
            <div className="flex items-center gap-1">
              <Shield className="size-3.5 text-blue-400" aria-hidden="true" />
              <span>DEF: {def === -1 ? "?" : def}</span>
            </div>
          </div>
        )}
      </div>
    </Link>
  );
}

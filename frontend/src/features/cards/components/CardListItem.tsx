import { Flame, Shield, Star } from "lucide-react";
import { Link } from "react-router";

import Badge from "../../../components/ui/Badge";
import { API_BASE_URL } from "../../../config/env";
import { getCardKind } from "../../../features/cards/utils/cardKind";
import type { Card } from "../../../types";

/**
 * CardListItem component renders a preview representation of a card in a horizontal list layout.
 * It showcases the cropped artwork, type, attribute, name, description, and monster statistics.
 *
 * @param props - The card details based on {@link Card} type.
 * @returns The rendered list item.
 */
export default function CardListItem({
  id,
  name,
  type,
  description,
  attribute,
  archetype,
  atk,
  def,
  level,
  imageUrlCropped,
}: Card) {
  const cardKind = getCardKind(type);
  const isMonster = cardKind === "monster";

  return (
    <Link
      to={`/cards/${id}`}
      viewTransition
      className="deck-card-base hover-hologram group flex items-center justify-between gap-4 p-3"
    >
      <div className="flex min-w-0 flex-1 items-center gap-4">
        <div className="bg-dark-surface-elevated border-border-dim relative flex aspect-4/5 w-12 shrink-0 items-center justify-center overflow-hidden rounded border">
          {imageUrlCropped ? (
            <img
              src={`${API_BASE_URL}/api/${imageUrlCropped}`}
              alt={name}
              className="size-full object-cover"
            />
          ) : (
            <span className="text-2xs font-bold text-slate-400 uppercase">YuGi</span>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="mb-1 flex flex-wrap items-center gap-2">
            <Badge variant={cardKind} className="px-1.5 py-0.5">
              {type}
            </Badge>
            {attribute && (
              <span className="text-2xs rounded border border-white/10 bg-slate-900/60 px-1.5 py-0.5 font-bold text-white uppercase">
                {attribute}
              </span>
            )}
            {isMonster && level && (
              <div className="text-gold-accent flex items-center gap-0.5">
                <Star className="size-3 fill-current" aria-hidden="true" />
                <span className="text-2xs font-bold">{level}</span>
              </div>
            )}
            {archetype && (
              <span className="text-2xs font-semibold text-slate-400">{archetype}</span>
            )}
          </div>

          <h3 className="font-display group-hover:text-cyan-accent mb-1 line-clamp-1 text-base font-bold text-white transition-colors duration-200">
            {name}
          </h3>
          <p className="line-clamp-1 max-w-3xl text-xs text-slate-400">{description}</p>
        </div>
      </div>

      {isMonster && (atk !== undefined || def !== undefined) && (
        <div className="bg-dark-surface-elevated/40 border-border-dim/50 text-2xs flex shrink-0 items-center gap-3 rounded border px-3 py-1.5 font-semibold text-slate-300">
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
    </Link>
  );
}

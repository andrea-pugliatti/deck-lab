import { Flame, Shield, Star } from "lucide-react";
import { Link } from "react-router";

import type { Card } from "../../types";
import { getCardTheme } from "../../utils/card";

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
  const isMonster = type?.toLowerCase().includes("monster");
  const { gridBadgeColor: badgeColor } = getCardTheme(type);
  const apiBaseUrl = import.meta.env.DEV ? "" : import.meta.env.VITE_API_URL || "";

  return (
    <Link
      to={`/cards/${id}`}
      viewTransition
      className="bg-dark-surface/40 border-border-dim/60 hover-hologram hover:border-cyan-accent/50 group flex w-full items-center justify-between gap-4 overflow-hidden rounded-xl border p-3 text-inherit no-underline backdrop-blur-sm transition-all duration-300 hover:shadow-[0_4px_25px_rgba(95,227,217,0.04)]"
    >
      <div className="flex min-w-0 flex-1 items-center gap-4">
        <div className="bg-dark-surface-elevated border-border-dim relative flex aspect-4/5 w-12 shrink-0 items-center justify-center overflow-hidden rounded border">
          {imageUrlCropped ? (
            <img
              src={`${apiBaseUrl}/api/${imageUrlCropped}`}
              alt={name}
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="text-[7px] font-bold text-slate-600 uppercase">YuGi</span>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="mb-1 flex flex-wrap items-center gap-2">
            <span
              className={`rounded border px-1.5 py-0.5 text-[8px] font-bold tracking-widest uppercase ${badgeColor}`}
            >
              {type}
            </span>
            {attribute && (
              <span className="rounded border border-white/10 bg-slate-900/60 px-1.5 py-0.5 text-[8px] font-bold text-white uppercase">
                {attribute}
              </span>
            )}
            {isMonster && level && (
              <div className="text-gold-accent flex items-center gap-0.5">
                <Star className="h-3 w-3 fill-current" />
                <span className="text-[10px] font-bold">{level}</span>
              </div>
            )}
            {archetype && (
              <span className="text-[10px] font-semibold text-slate-500">{archetype}</span>
            )}
          </div>

          <h3 className="font-display group-hover:text-cyan-accent mb-1 line-clamp-1 text-base font-bold text-white transition-colors duration-200">
            {name}
          </h3>
          <p className="line-clamp-1 max-w-3xl text-xs text-slate-400">{description}</p>
        </div>
      </div>

      {isMonster && (atk !== undefined || def !== undefined) && (
        <div className="bg-dark-surface-elevated/40 border-border-dim/50 flex shrink-0 items-center gap-3 rounded border px-3 py-1.5 text-[10px] font-semibold text-slate-300">
          <div className="flex items-center gap-1">
            <Flame className="h-3.5 w-3.5 text-amber-500" />
            <span>ATK: {atk === -1 ? "?" : atk}</span>
          </div>
          <div className="flex items-center gap-1">
            <Shield className="h-3.5 w-3.5 text-blue-400" />
            <span>DEF: {def === -1 ? "?" : def}</span>
          </div>
        </div>
      )}
    </Link>
  );
}

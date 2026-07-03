import { Flame, Shield, Star } from "lucide-react";
import { Link } from "react-router";

import type { Card } from "../../types";
import { getCardTheme } from "../../utils/card";

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
  race,
  attribute,
  archetype,
  atk,
  def,
  level,
  imageUrlCropped,
}: Card) {
  const isMonster = type?.toLowerCase().includes("monster");
  const { gridBadgeColor: badgeColor } = getCardTheme(type);

  return (
    <Link
      to={`/cards/${id}`}
      viewTransition
      className="bg-dark-surface/40 border-border-dim/60 hover-hologram hover:border-cyan-accent/50 group flex flex-col justify-between overflow-hidden rounded-xl border text-inherit no-underline backdrop-blur-sm transition-all duration-300 hover:shadow-[0_4px_25px_rgba(95,227,217,0.08)]"
    >
      <div className="bg-dark-surface-elevated border-border-dim relative flex aspect-video items-center justify-center overflow-hidden border-b">
        {imageUrlCropped ? (
          <img
            src={`/api/${imageUrlCropped}`}
            alt={name}
            className="h-full w-full object-cover transition-transform duration-500"
          />
        ) : (
          <>
            <div className="pointer-events-none absolute inset-0 bg-radial from-slate-700/10 to-transparent"></div>
            <span className="font-display text-xs font-bold tracking-widest text-slate-500 uppercase transition-transform duration-300 group-hover:scale-105">
              [ {archetype || race || "Artwork"} ]
            </span>
          </>
        )}
        {attribute && (
          <span className="absolute top-2 right-2 rounded border border-white/10 bg-slate-900/60 px-1.5 py-0.5 text-[9px] font-bold text-white uppercase">
            {attribute}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col justify-between p-4">
        <div className="mb-4">
          <div className="mb-1 flex items-center justify-between gap-2">
            <span
              className={`rounded border px-1.5 py-0.5 text-[9px] font-bold tracking-widest uppercase ${badgeColor}`}
            >
              {type}
            </span>
            {isMonster && level && (
              <div className="text-gold-accent flex items-center gap-0.5">
                <Star className="h-3.5 w-3.5 fill-current" />
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
              <Flame className="h-3.5 w-3.5 text-amber-500" />
              <span>ATK: {atk === -1 ? "?" : atk}</span>
            </div>
            <div className="flex items-center gap-1">
              <Shield className="h-3.5 w-3.5 text-blue-400" />
              <span>DEF: {def === -1 ? "?" : def}</span>
            </div>
          </div>
        )}
      </div>
    </Link>
  );
}

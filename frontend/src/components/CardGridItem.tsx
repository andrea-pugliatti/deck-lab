import { Flame, Shield, Star } from "lucide-react";
import { Link } from "react-router";
import type { Card } from "../types";

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
  const isMonster = type.toLowerCase().includes("monster");
  const isSpell = type.toLowerCase().includes("spell");
  const isTrap = type.toLowerCase().includes("trap");

  let badgeColor = "text-slate-400 bg-slate-400/10";
  if (isSpell) {
    badgeColor = "text-emerald-400 bg-emerald-400/10 border-emerald-400/20";
  } else if (isTrap) {
    badgeColor = "text-rose-400 bg-rose-400/10 border-rose-400/20";
  } else if (isMonster) {
    badgeColor = "text-amber-400 bg-amber-400/10 border-amber-400/20";
  }

  return (
    <Link
      to={`/cards/${id}`}
      className="bg-dark-surface border border-border-dim rounded-lg overflow-hidden flex flex-col justify-between transition-all duration-300 hover:border-border-glow hover:shadow-md group no-underline text-inherit"
    >
      <div className="relative aspect-video bg-dark-surface-elevated flex items-center justify-center border-b border-border-dim overflow-hidden">
        {imageUrlCropped ? (
          <img
            src={`/api/${imageUrlCropped}`}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <>
            <div className="absolute inset-0 bg-radial from-slate-700/10 to-transparent pointer-events-none"></div>
            <span className="font-display text-xs text-slate-500 font-bold uppercase tracking-widest group-hover:scale-105 transition-transform duration-300">
              [ {archetype || race || "Artwork"} ]
            </span>
          </>
        )}
        {attribute && (
          <span className="absolute top-2 right-2 text-[9px] font-bold text-white bg-slate-900/60 px-1.5 py-0.5 rounded border border-white/10 uppercase">
            {attribute}
          </span>
        )}
      </div>

      <div className="p-4 flex-1 flex flex-col justify-between">
        <div className="mb-4">
          <div className="flex items-center justify-between gap-2 mb-1">
            <span
              className={`text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded border ${badgeColor}`}
            >
              {type}
            </span>
            {isMonster && level && (
              <div className="flex items-center gap-0.5 text-gold-accent">
                <Star className="w-3.5 h-3.5 fill-current" />
                <span className="text-xs font-bold">{level}</span>
              </div>
            )}
          </div>
          <h3 className="font-display text-base font-bold text-white mb-1 group-hover:text-cyan-accent transition-colors duration-200 line-clamp-1">
            {name}
          </h3>
          <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{description}</p>
        </div>

        {isMonster && (atk !== undefined || def !== undefined) && (
          <div className="flex items-center justify-between text-xs font-semibold text-slate-300 bg-dark-surface-elevated/40 border border-border-dim/50 rounded px-2.5 py-1.5 mt-auto">
            <div className="flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-amber-500" />
              <span>ATK: {atk === -1 ? "?" : atk}</span>
            </div>
            <div className="flex items-center gap-1">
              <Shield className="w-3.5 h-3.5 text-blue-400" />
              <span>DEF: {def === -1 ? "?" : def}</span>
            </div>
          </div>
        )}
      </div>
    </Link>
  );
}

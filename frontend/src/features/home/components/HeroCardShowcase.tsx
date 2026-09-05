import { Flame, Sparkles, Star, Zap } from "lucide-react";
import { useRef } from "react";
import type { MouseEvent } from "react";

import { API_BASE_URL } from "../../../config/env";
import type { Card } from "../../../types";

/**
 * Props for the {@link HeroCardShowcase} component.
 */
export interface HeroCardShowcaseProps {
  cards: Card[];
  loading: boolean;
}

const CARDS_OFFSETS = [
  "z-10 hover:z-40 animate-float-left",
  "z-20 hover:z-40 animate-float-right",
  "z-30 hover:z-40 animate-float-center",
];

const getAttributeStyles = (attr?: string): string => {
  if (!attr) return "text-slate-300 bg-slate-950/40 border-slate-500/20";
  switch (attr.toUpperCase()) {
    case "LIGHT":
      return "text-amber-200 bg-amber-500/20 border-amber-400/30";
    case "DARK":
      return "text-fuchsia-300 bg-fuchsia-950/40 border-fuchsia-500/30";
    case "FIRE":
      return "text-rose-300 bg-rose-950/40 border-rose-500/30";
    case "WATER":
      return "text-sky-300 bg-sky-950/40 border-sky-500/30";
    case "EARTH":
      return "text-orange-200 bg-orange-950/40 border-orange-500/30";
    case "WIND":
      return "text-emerald-300 bg-emerald-950/40 border-emerald-500/30";
    default:
      return "text-slate-300 bg-slate-950/40 border-slate-500/30";
  }
};

/**
 * A interactive 3D parallax card showcase component used in the Hero section.
 * Renders multiple card templates overlapping each other, which tilt dynamically
 * based on the user's mouse position to create a 3D effect.
 */
export default function HeroCardShowcase({ cards, loading }: HeroCardShowcaseProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const showcaseRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current || !showcaseRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const width = rect.width || 1;
    const height = rect.height || 1;

    const mouseX = e.clientX - rect.left - width / 2;
    const mouseY = e.clientY - rect.top - height / 2;

    const rX = -(mouseY / (height / 2)) * 12;
    const rY = (mouseX / (width / 2)) * 12;

    showcaseRef.current.style.transform = `rotateX(${rX}deg) rotateY(${rY}deg)`;
  };

  const handleMouseLeave = () => {
    if (showcaseRef.current) {
      showcaseRef.current.style.transform = "rotateX(0deg) rotateY(0deg)";
    }
  };

  if (!loading && (!cards || cards.length === 0)) {
    return null;
  }

  return (
    <div
      className="relative mx-auto flex h-100 w-full max-w-105 cursor-default items-center justify-center select-none perspective-[1000px] sm:h-120"
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div
        ref={showcaseRef}
        className="relative flex size-full items-center justify-center transition-transform duration-300 ease-out transform-3d"
      >
        {cards.map((card, index) => {
          if (!loading && (!cards || cards.length <= index)) {
            return null;
          }

          const isSpell = card?.type.toLowerCase().includes("spell");
          const isTrap = card?.type.toLowerCase().includes("trap");
          const isMonster = !isSpell && !isTrap;
          const croppedUrl = card?.imageUrlCropped;
          const FallbackIcon = isSpell ? Sparkles : isTrap ? Zap : Flame;
          const fallbackIconColor = isSpell
            ? "text-emerald-400"
            : isTrap
              ? "text-rose-400"
              : "text-orange-400";
          const artGradient = isSpell
            ? "from-emerald-950/60 via-teal-900/30 to-stone-950/70"
            : isTrap
              ? "from-rose-950/60 via-purple-900/30 to-stone-950/70"
              : "from-purple-950/60 via-indigo-900/40 to-slate-950/70";

          return (
            <div
              key={index}
              className={`bg-dark-bg hover:shadow-glow-cyan-lg absolute flex h-67.5 w-45 flex-col justify-between rounded-xl border p-2.5 shadow-2xl transition-all duration-300 ease-out backface-hidden transform-3d hover:scale-105 sm:h-80 sm:w-55 sm:p-3 ${CARDS_OFFSETS[index]} border-slate-500/20 text-slate-300`}
            >
              <>
                <div className="mb-1 flex items-center justify-between">
                  <span
                    className="font-display text-2xs max-w-25 truncate font-bold tracking-wide text-white sm:max-w-32.5 sm:text-xs"
                    title={card?.name}
                  >
                    {card?.name}
                  </span>
                  {card?.attribute && (
                    <span
                      className={`text-2xs shrink-0 scale-90 rounded border px-1 py-0.5 font-extrabold uppercase sm:px-1.5 ${getAttributeStyles(card?.attribute)}`}
                    >
                      {card?.attribute}
                    </span>
                  )}
                </div>

                <div className="mb-1 flex min-h-3 origin-left scale-75 gap-0.5 sm:mb-1.5 sm:scale-90">
                  {isMonster &&
                    card?.level !== undefined &&
                    card?.level > 0 &&
                    [...Array(Math.min(card?.level, 12))].map((_, i) => (
                      <Star
                        key={i}
                        className="fill-gold-accent text-gold-accent size-2.5"
                        aria-hidden="true"
                      />
                    ))}
                </div>

                <div className="border-border-dim/60 bg-dark-surface-elevated/40 group relative mb-1.5 flex flex-1 items-center justify-center overflow-hidden rounded border sm:mb-2">
                  {croppedUrl ? (
                    <img
                      src={`${API_BASE_URL}/api/${croppedUrl}`}
                      className="size-full object-cover"
                      alt={card?.name}
                    />
                  ) : (
                    <div
                      className={`size-full bg-linear-to-br ${artGradient} relative flex items-center justify-center`}
                    >
                      <div className="absolute inset-0 opacity-30"></div>
                      <FallbackIcon
                        className={`size-10 sm:size-12 ${fallbackIconColor} drop-shadow-[0_0_12px_rgba(255,255,255,0.2)] transition-transform duration-500 group-hover:scale-110`}
                      />
                    </div>
                  )}
                </div>

                <div className="bg-dark-surface/80 border-border-dim/40 mb-1 rounded border p-1 sm:mb-1.5 sm:p-1.5">
                  <span className="text-gold-accent text-2xs mb-0.5 block leading-none font-bold tracking-wide uppercase">
                    [{card?.type}]
                  </span>
                  <p
                    className="text-2xs line-clamp-3 leading-normal font-light text-slate-400"
                    title={card?.description}
                  >
                    {card?.description}
                  </p>
                </div>

                <div className="bg-dark-surface-elevated/40 border-border-dim/40 text-2xs flex items-center justify-between rounded border px-1.5 py-0.5 font-bold text-slate-300 sm:px-2 sm:py-1">
                  {isMonster ? (
                    <>
                      <span className="flex items-center gap-0.5">
                        ATK:{" "}
                        <span className="font-mono text-white">
                          {card?.atk === -1 ? "?" : card?.atk}
                        </span>
                      </span>
                      <span className="flex items-center gap-0.5">
                        DEF:{" "}
                        <span className="font-mono text-white">
                          {card?.def === -1 ? "?" : card?.def}
                        </span>
                      </span>
                    </>
                  ) : (
                    <span className="text-cyan-accent text-2xs w-full text-center tracking-wider uppercase">
                      {isSpell ? "Spell Card" : "Trap Card"}
                    </span>
                  )}
                </div>
              </>
            </div>
          );
        })}
      </div>
    </div>
  );
}

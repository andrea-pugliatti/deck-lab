import { Flame, Sparkles, Star, Zap } from "lucide-react";
import { useRef, useState } from "react";
import type { MouseEvent } from "react";
import type { Card } from "../types";

interface HeroCardShowcaseProps {
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

export default function HeroCardShowcase({ cards, loading }: HeroCardShowcaseProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    const mouseX = e.clientX - rect.left - width / 2;
    const mouseY = e.clientY - rect.top - height / 2;

    const rX = -(mouseY / (height / 2)) * 12;
    const rY = (mouseX / (width / 2)) * 12;

    setRotateX(rX);
    setRotateY(rY);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  if (!loading && (!cards || cards.length === 0)) {
    return null;
  }

  return (
    <div
      className="relative w-full max-w-105 h-100 sm:h-120 mx-auto flex items-center justify-center cursor-default select-none touch-none"
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective: "1000px",
      }}
    >
      <div
        className="relative w-full h-full transition-transform duration-300 ease-out flex items-center justify-center"
        style={{
          transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
          transformStyle: "preserve-3d",
        }}
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
              className={`absolute w-45 h-67.5 sm:w-55 sm:h-80 bg-dark-bg border rounded-xl p-2.5 sm:p-3 flex flex-col justify-between transition-all duration-300 ease-out hover:scale-105 shadow-2xl hover:shadow-[0_0_30px_rgba(0,227,217,0.15)] ${CARDS_OFFSETS[index]} text-slate-300 border-slate-500/20`}
              style={{
                transformStyle: "preserve-3d",
                backfaceVisibility: "hidden",
              }}
            >
              <>
                <div className="flex justify-between items-center mb-1">
                  <span
                    className="font-display text-[8.5px] sm:text-[10px] font-bold text-white tracking-wide truncate max-w-25 sm:max-w-32.5"
                    title={card?.name}
                  >
                    {card?.name}
                  </span>
                  {card?.attribute && (
                    <span
                      className={`text-[7px] sm:text-[8px] font-extrabold px-1 sm:px-1.5 py-0.5 rounded border uppercase shrink-0 scale-90 ${getAttributeStyles(card?.attribute)}`}
                    >
                      {card?.attribute}
                    </span>
                  )}
                </div>

                <div className="flex gap-0.5 mb-1 sm:mb-1.5 scale-75 sm:scale-90 origin-left min-h-3">
                  {isMonster &&
                    card?.level !== undefined &&
                    card?.level > 0 &&
                    [...Array(Math.min(card?.level, 12))].map((_, i) => (
                      <Star key={i} className="w-2.5 h-2.5 fill-gold-accent text-gold-accent" />
                    ))}
                </div>

                <div className="relative flex-1 rounded border border-border-dim/60 bg-dark-surface-elevated/40 overflow-hidden flex items-center justify-center group mb-1.5 sm:mb-2">
                  {croppedUrl ? (
                    <img
                      src={`/api/${croppedUrl}`}
                      className="w-full h-full object-cover transition-transform duration-500"
                      alt={card?.name}
                    />
                  ) : (
                    <div
                      className={`w-full h-full bg-linear-to-br ${artGradient} flex items-center justify-center relative`}
                    >
                      <div className="absolute inset-0 opacity-30"></div>
                      <FallbackIcon
                        className={`w-10 h-10 sm:w-12 sm:h-12 ${fallbackIconColor} drop-shadow-[0_0_12px_rgba(255,255,255,0.2)] group-hover:scale-110 transition-transform duration-500`}
                      />
                    </div>
                  )}
                </div>

                <div className="bg-dark-surface/80 border border-border-dim/40 rounded p-1 sm:p-1.5 mb-1 sm:mb-1.5">
                  <span className="block font-bold text-[7px] sm:text-[8px] text-gold-accent leading-none uppercase tracking-wide mb-0.5">
                    [{card?.type}]
                  </span>
                  <p
                    className="text-[6.5px] sm:text-[7.5px] text-slate-400 leading-normal line-clamp-3 font-light"
                    title={card?.description}
                  >
                    {card?.description}
                  </p>
                </div>

                <div className="flex justify-between items-center text-[7.5px] sm:text-[8.5px] font-bold text-slate-300 bg-dark-surface-elevated/40 border border-border-dim/40 rounded px-1.5 sm:px-2 py-0.5 sm:py-1">
                  {isMonster ? (
                    <>
                      <span className="flex items-center gap-0.5">
                        ATK:{" "}
                        <span className="text-white font-mono">
                          {card?.atk === -1 ? "?" : card?.atk}
                        </span>
                      </span>
                      <span className="flex items-center gap-0.5">
                        DEF:{" "}
                        <span className="text-white font-mono">
                          {card?.def === -1 ? "?" : card?.def}
                        </span>
                      </span>
                    </>
                  ) : (
                    <span className="text-center w-full uppercase tracking-wider text-[7px] sm:text-[8px] text-cyan-accent">
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

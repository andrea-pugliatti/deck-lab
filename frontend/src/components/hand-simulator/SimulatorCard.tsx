import { Move } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { SimulatorCardInstance } from "../../types";

interface SimulatorCardProps {
  card: SimulatorCardInstance;
  currentZone: "hand" | "field" | "graveyard" | "banished" | "deck";
  onMove: (
    card: SimulatorCardInstance,
    toZone: "hand" | "field" | "graveyard" | "banished" | "deck-top" | "deck-bottom",
  ) => void;
  onViewDetails?: (card: SimulatorCardInstance) => void;
}

export default function SimulatorCard({
  card,
  currentZone,
  onMove,
  onViewDetails,
}: SimulatorCardProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const isMonster = card.type?.toLowerCase().includes("monster") || false;
  const isSpell = card.type?.toLowerCase().includes("spell") || false;
  const isTrap = card.type?.toLowerCase().includes("trap") || false;

  let glowColor = "hover:shadow-[0_0_15px_rgba(148,163,184,0.3)] hover:border-slate-500/40";
  let borderColor = "border-slate-500/20";
  if (isSpell) {
    glowColor = "hover:shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:border-emerald-500/40";
    borderColor = "border-emerald-500/20";
  } else if (isTrap) {
    glowColor = "hover:shadow-[0_0_15px_rgba(244,63,94,0.3)] hover:border-rose-500/40";
    borderColor = "border-rose-500/20";
  } else if (isMonster) {
    glowColor = "hover:shadow-[0_0_15px_rgba(245,158,11,0.35)] hover:border-amber-500/40";
    borderColor = "border-amber-500/20";
  }

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }
    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  const handleAction = (
    toZone: "hand" | "field" | "graveyard" | "banished" | "deck-top" | "deck-bottom",
  ) => {
    onMove(card, toZone);
    setIsMenuOpen(false);
  };

  return (
    <div className="relative group/card select-none" ref={menuRef}>
      <div
        onClick={() => {
          setIsMenuOpen(!isMenuOpen);
          onViewDetails?.(card);
        }}
        className={`relative aspect-244/356 w-full rounded-lg overflow-hidden border bg-slate-950 transition-all duration-200 transform cursor-pointer group-hover/card:-translate-y-1 ${borderColor} ${glowColor}`}
      >
        {card.imageUrl ? (
          <img
            src={`/api/${card.imageUrl}`}
            alt={card.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex flex-col justify-between p-3 text-center bg-dark-surface-elevated/40">
            <span className="text-[9px] font-bold text-slate-500 tracking-wider block uppercase">
              {card.type?.replace(" Card", "")}
            </span>
            <span className="text-[10px] font-bold text-white uppercase font-display line-clamp-3">
              {card.name}
            </span>
            <span className="text-[8px] text-slate-600 block">[ No Art ]</span>
          </div>
        )}
      </div>

      {isMenuOpen && (
        <div className="absolute z-50 left-1/2 transform -translate-x-1/2 mt-1.5 w-40 bg-dark-surface-elevated/95 backdrop-blur-md border border-border-dim rounded-xl shadow-2xl p-1.5 animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="text-[9px] font-bold uppercase tracking-wider text-slate-500 px-2 py-1 flex items-center gap-1 border-b border-border-dim/40 mb-1">
            <Move className="w-2.5 h-2.5" /> Move Card
          </div>

          <div className="space-y-0.5 max-h-45 overflow-y-auto">
            {currentZone !== "hand" && (
              <button
                onClick={() => handleAction("hand")}
                className="w-full text-left text-xs font-semibold px-2 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-cyan-accent/15 transition-all cursor-pointer"
              >
                To Hand
              </button>
            )}

            {currentZone !== "field" && (
              <button
                onClick={() => handleAction("field")}
                className="w-full text-left text-xs font-semibold px-2 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-cyan-accent/15 transition-all cursor-pointer"
              >
                To Field (Summon)
              </button>
            )}

            {currentZone !== "graveyard" && (
              <button
                onClick={() => handleAction("graveyard")}
                className="w-full text-left text-xs font-semibold px-2 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-cyan-accent/15 transition-all cursor-pointer"
              >
                To Graveyard (GY)
              </button>
            )}

            {currentZone !== "banished" && (
              <button
                onClick={() => handleAction("banished")}
                className="w-full text-left text-xs font-semibold px-2 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-cyan-accent/15 transition-all cursor-pointer"
              >
                To Banished (Banish)
              </button>
            )}

            {currentZone !== "deck" && (
              <>
                <button
                  onClick={() => handleAction("deck-top")}
                  className="w-full text-left text-xs font-semibold px-2 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-cyan-accent/15 transition-all cursor-pointer"
                >
                  To Deck Top
                </button>
                <button
                  onClick={() => handleAction("deck-bottom")}
                  className="w-full text-left text-xs font-semibold px-2 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-cyan-accent/15 transition-all cursor-pointer"
                >
                  To Deck Bottom
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

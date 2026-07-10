import { Move } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import type { SimulatorCardInstance } from "../../types";
import { getCardTheme } from "../../utils/card";

/**
 * Props for the {@link SimulatorCard} component.
 */
interface SimulatorCardProps {
  card: SimulatorCardInstance;
  currentZone: "hand" | "field" | "graveyard" | "banished" | "deck";
  onMove: (
    card: SimulatorCardInstance,
    toZone: "hand" | "field" | "graveyard" | "banished" | "deck-top" | "deck-bottom",
  ) => void;
  onViewDetails?: (card: SimulatorCardInstance) => void;
}

/**
 * SimulatorCard component.
 * Renders an individual card in the Hand Simulator workspace.
 * Features an interactive dropdown menu on click allowing the card to be moved
 * to other zones (Hand, Field, GY, Banish, Deck Top/Bottom) and triggers detail inspection.
 *
 * @param props - The component props.
 * @returns A JSX element representing the simulator card and its context menu.
 */
export default function SimulatorCard({
  card,
  currentZone,
  onMove,
  onViewDetails,
}: SimulatorCardProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const apiBaseUrl = import.meta.env.DEV ? "" : import.meta.env.VITE_API_URL || "";

  const { borderColor, glowColor } = getCardTheme(card.type);

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
    <div className="group/card relative select-none" ref={menuRef}>
      <div
        onClick={() => {
          setIsMenuOpen(!isMenuOpen);
          onViewDetails?.(card);
        }}
        className={`relative aspect-244/356 w-full transform cursor-pointer overflow-hidden rounded-lg border bg-slate-950 transition-all duration-200 group-hover/card:-translate-y-1 ${borderColor} ${glowColor}`}
      >
        {card.imageUrl ? (
          <img
            src={`${apiBaseUrl}/api/${card.imageUrl}`}
            alt={card.name}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="bg-dark-surface-elevated/40 flex h-full w-full flex-col justify-between p-3 text-center">
            <span className="block text-[9px] font-bold tracking-wider text-slate-500 uppercase">
              {card.type?.replace(" Card", "")}
            </span>
            <span className="font-display line-clamp-3 text-[10px] font-bold text-white uppercase">
              {card.name}
            </span>
            <span className="block text-[8px] text-slate-600">[ No Art ]</span>
          </div>
        )}
      </div>

      {isMenuOpen && (
        <div className="bg-dark-surface-elevated/95 border-border-dim animate-in fade-in slide-in-from-top-2 absolute left-1/2 z-50 mt-1.5 w-40 -translate-x-1/2 transform rounded-xl border p-1.5 shadow-2xl backdrop-blur-md duration-150">
          <div className="border-border-dim/40 mb-1 flex items-center gap-1 border-b px-2 py-1 text-[9px] font-bold tracking-wider text-slate-500 uppercase">
            <Move className="h-2.5 w-2.5" /> Move Card
          </div>

          <div className="max-h-45 space-y-0.5 overflow-y-auto">
            {currentZone !== "hand" && (
              <button
                onClick={() => handleAction("hand")}
                className="hover:bg-cyan-accent/15 w-full cursor-pointer rounded-lg px-2 py-1.5 text-left text-xs font-semibold text-slate-300 transition-all hover:text-white"
              >
                To Hand
              </button>
            )}

            {currentZone !== "field" && (
              <button
                onClick={() => handleAction("field")}
                className="hover:bg-cyan-accent/15 w-full cursor-pointer rounded-lg px-2 py-1.5 text-left text-xs font-semibold text-slate-300 transition-all hover:text-white"
              >
                To Field (Summon)
              </button>
            )}

            {currentZone !== "graveyard" && (
              <button
                onClick={() => handleAction("graveyard")}
                className="hover:bg-cyan-accent/15 w-full cursor-pointer rounded-lg px-2 py-1.5 text-left text-xs font-semibold text-slate-300 transition-all hover:text-white"
              >
                To Graveyard (GY)
              </button>
            )}

            {currentZone !== "banished" && (
              <button
                onClick={() => handleAction("banished")}
                className="hover:bg-cyan-accent/15 w-full cursor-pointer rounded-lg px-2 py-1.5 text-left text-xs font-semibold text-slate-300 transition-all hover:text-white"
              >
                To Banished (Banish)
              </button>
            )}

            {currentZone !== "deck" && (
              <>
                <button
                  onClick={() => handleAction("deck-top")}
                  className="hover:bg-cyan-accent/15 w-full cursor-pointer rounded-lg px-2 py-1.5 text-left text-xs font-semibold text-slate-300 transition-all hover:text-white"
                >
                  To Deck Top
                </button>
                <button
                  onClick={() => handleAction("deck-bottom")}
                  className="hover:bg-cyan-accent/15 w-full cursor-pointer rounded-lg px-2 py-1.5 text-left text-xs font-semibold text-slate-300 transition-all hover:text-white"
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

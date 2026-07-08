import type { ReactNode } from "react";

import type { SimulatorCardInstance } from "../../types";
import SimulatorCard from "./SimulatorCard";

/**
 * Props for the {@link ZonePanel} component.
 */
export interface ZonePanelProps {
  title: string;
  icon?: ReactNode;
  cards: SimulatorCardInstance[];
  currentZone: "hand" | "field" | "graveyard" | "banished" | "deck";
  onMoveCard: (
    card: SimulatorCardInstance,
    toZone: "hand" | "field" | "graveyard" | "banished" | "deck-top" | "deck-bottom",
  ) => void;
  onViewDetails: (card: SimulatorCardInstance) => void;
  emptyStateText: string;
  gridClassName?: string;
  countBadgeClassName?: string;
}

/**
 * ZonePanel component.
 * Encapsulates the visual presentation of a card simulator zone:
 * a header containing an icon, title, and card count, along with a grid of cards
 * or an empty state when no cards are present.
 *
 * @returns React element representing a zone panel.
 */
export default function ZonePanel({
  title,
  icon,
  cards,
  currentZone,
  onMoveCard,
  onViewDetails,
  emptyStateText,
  gridClassName = "grid grid-cols-3 gap-3.5 sm:grid-cols-4 md:grid-cols-5",
  countBadgeClassName = "rounded border px-2 py-0.5 text-[10px] font-bold",
}: ZonePanelProps) {
  return (
    <div className="bg-dark-surface border-border-dim rounded-2xl border p-5 shadow-md">
      <div className="border-border-dim/60 mb-4 flex items-center justify-between border-b pb-3">
        <h4 className="font-display flex items-center gap-2 text-sm font-bold text-white">
          {icon}
          {title}
        </h4>
        <span className={countBadgeClassName}>{cards.length} Cards</span>
      </div>

      {cards.length > 0 ? (
        <div className={gridClassName}>
          {cards.map((card) => (
            <SimulatorCard
              key={card.uniqId}
              card={card}
              currentZone={currentZone}
              onMove={onMoveCard}
              onViewDetails={onViewDetails}
            />
          ))}
        </div>
      ) : (
        <div className="border-border-dim/90 rounded-xl border border-dashed py-12 text-center text-xs text-slate-500">
          {emptyStateText}
        </div>
      )}
    </div>
  );
}

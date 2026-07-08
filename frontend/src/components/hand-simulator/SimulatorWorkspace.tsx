import { Calculator, Hand, Layers, RotateCcw, Search, Shuffle } from "lucide-react";
import { useState } from "react";

import { useHandSimulator } from "../../hooks/useHandSimulator";
import type { Deck, SimulatorCardInstance } from "../../types";
import Button from "../ui/Button";
import CardInspector from "./CardInspector";
import DeckExplorerModal from "./DeckExplorerModal";
import ProbabilityCalculator from "./ProbabilityCalculator";
import ZonePanel from "./ZonePanel";

/**
 * Props for the {@link SimulatorWorkspace} component.
 */
interface SimulatorWorkspaceProps {
  deck?: Deck;
}

/**
 * SimulatorWorkspace component.
 * Acts as the primary orchestrator and layout container for the Hand Simulator workspace.
 * Manages hand, field, graveyard, banished, and remaining deck zones, and connects them
 * to the card inspector, deck explorer modal, and probability (consistency) calculator.
 *
 * @param props - Component properties.
 * @returns React element representing the simulator workspace.
 */
export default function SimulatorWorkspace({ deck }: SimulatorWorkspaceProps) {
  const {
    hand,
    field,
    graveyard,
    banished,
    remainingDeck,
    draw: onDraw,
    shuffleDeck: onShuffle,
    reset: onReset,
    moveCard: onMoveCard,
  } = useHandSimulator(deck, 5);

  const [handSizeConfig, setHandSizeConfig] = useState<5 | 6>(5);
  const [showDeckExplorer, setShowDeckExplorer] = useState(false);
  const [showProbabilityModal, setShowProbabilityModal] = useState(false);
  const [inspectedCard, setInspectedCard] = useState<SimulatorCardInstance>();

  const activeInspectedCard = inspectedCard || hand[0];

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
      <aside className="flex flex-col space-y-4 lg:col-span-3">
        <CardInspector inspectedCard={activeInspectedCard} />
        <Button
          variant="outline-cyan"
          onClick={() => setShowProbabilityModal(true)}
          className="w-full py-3 text-xs"
        >
          <Calculator className="h-4 w-4" />
          <span>Consistency Calculator</span>
        </Button>
      </aside>

      <div className="space-y-6 lg:col-span-9">
        <div className="bg-dark-surface border-border-dim flex flex-col justify-between gap-4 rounded-2xl border p-4 shadow-md md:flex-row md:items-center">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="mr-1 text-[10px] font-bold tracking-wider text-slate-500 uppercase">
                Hand Size:
              </span>
              <button
                onClick={() => setHandSizeConfig(5)}
                className={`flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg border font-mono text-xs font-bold transition-all ${
                  handSizeConfig === 5
                    ? "bg-cyan-accent border-cyan-accent text-dark-bg"
                    : "border-border-dim text-slate-400 hover:text-white"
                }`}
              >
                5
              </button>
              <button
                onClick={() => setHandSizeConfig(6)}
                className={`flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg border font-mono text-xs font-bold transition-all ${
                  handSizeConfig === 6
                    ? "bg-cyan-accent border-cyan-accent text-dark-bg"
                    : "border-border-dim text-slate-400 hover:text-white"
                }`}
              >
                6
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onReset(handSizeConfig)}
              className="flex items-center gap-1.5"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reset & Redraw
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDraw(1)}
              disabled={remainingDeck.length === 0}
              className="flex items-center gap-1.5"
            >
              <Layers className="text-cyan-accent h-3.5 w-3.5" />
              Draw 1
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onShuffle}
              className="flex items-center gap-1.5"
            >
              <Shuffle className="h-3.5 w-3.5 text-purple-400" />
              Shuffle
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                setShowDeckExplorer(true);
              }}
              className="flex items-center gap-1.5 font-bold"
            >
              <Search className="text-dark-bg h-3.5 w-3.5" />
              Search Deck
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          <ZonePanel
            title="HAND ZONE"
            icon={<Hand className="text-gold-accent h-4 w-4" />}
            cards={hand}
            currentZone="hand"
            onMoveCard={onMoveCard}
            onViewDetails={setInspectedCard}
            emptyStateText='Hand is empty. Click "Draw 1" or "Reset & Redraw" to add cards.'
            countBadgeClassName="text-gold-accent bg-gold-accent/10 border-gold-accent/20 rounded border px-2 py-0.5 text-[10px] font-bold"
          />

          <ZonePanel
            title="FIELD"
            icon={<Layers className="text-cyan-accent h-4 w-4" />}
            cards={field}
            currentZone="field"
            onMoveCard={onMoveCard}
            onViewDetails={setInspectedCard}
            emptyStateText='Field is empty. Click a card in your hand and select "To Field (Summon)".'
            countBadgeClassName="text-cyan-accent bg-cyan-accent/10 border-cyan-accent/20 rounded border px-2 py-0.5 text-[10px] font-bold"
          />

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <ZonePanel
              title="GRAVEYARD"
              icon={<Layers className="h-4 w-4 text-slate-400" />}
              cards={graveyard}
              currentZone="graveyard"
              onMoveCard={onMoveCard}
              onViewDetails={setInspectedCard}
              emptyStateText="Graveyard is empty."
              gridClassName="grid grid-cols-3 gap-2.5 pr-1 sm:grid-cols-4"
              countBadgeClassName="rounded bg-slate-400/10 px-2 py-0.5 text-[9px] font-bold text-slate-400"
            />

            <ZonePanel
              title="BANISHED ZONE"
              icon={<Layers className="h-4 w-4 text-purple-400" />}
              cards={banished}
              currentZone="banished"
              onMoveCard={onMoveCard}
              onViewDetails={setInspectedCard}
              emptyStateText="No cards banished."
              gridClassName="grid max-h-55 grid-cols-3 gap-2.5 pr-1 sm:grid-cols-4"
              countBadgeClassName="rounded bg-purple-400/10 px-2 py-0.5 text-[9px] font-bold text-purple-400"
            />
          </div>
        </div>
      </div>

      {showDeckExplorer && (
        <DeckExplorerModal
          deck={remainingDeck}
          setShowDeckExplorer={setShowDeckExplorer}
          handleActionFromExplorer={(card, toZone) => {
            onMoveCard(card, toZone);
          }}
        />
      )}

      {showProbabilityModal && (
        <ProbabilityCalculator
          cards={deck?.deckCards || []}
          onClose={() => setShowProbabilityModal(false)}
        />
      )}
    </div>
  );
}

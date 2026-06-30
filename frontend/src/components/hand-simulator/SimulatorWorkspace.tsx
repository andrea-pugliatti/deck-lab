import { Calculator, Layers, RotateCcw, Search, Shuffle, Sparkles } from "lucide-react";
import { useState } from "react";

import { useHandSimulator } from "../../hooks/useHandSimulator";
import type { Deck, SimulatorCardInstance } from "../../types";
import Button from "../ui/Button";
import CardInspector from "./CardInspector";
import DeckExplorerModal from "./DeckExplorerModal";
import ProbabilityCalculator from "./ProbabilityCalculator";
import SimulatorCard from "./SimulatorCard";

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
          <div className="bg-dark-surface border-border-dim rounded-2xl border p-5 shadow-md md:p-6">
            <div className="border-border-dim/60 mb-4 flex items-center justify-between border-b pb-3">
              <h4 className="font-display flex items-center gap-2 text-sm font-bold text-white">
                <Sparkles className="text-gold-accent h-4 w-4" />
                HAND ZONE
              </h4>
              <span className="text-gold-accent bg-gold-accent/10 border-gold-accent/20 rounded border px-2 py-0.5 text-[10px] font-bold">
                {hand.length} Cards
              </span>
            </div>

            {hand.length > 0 ? (
              <div className="grid grid-cols-3 gap-3.5 sm:grid-cols-4 md:grid-cols-5">
                {hand.map((card) => (
                  <SimulatorCard
                    key={card.uniqId}
                    card={card}
                    currentZone="hand"
                    onMove={onMoveCard}
                    onViewDetails={(card: SimulatorCardInstance) => {
                      setInspectedCard(card);
                    }}
                  />
                ))}
              </div>
            ) : (
              <div className="border-border-dim/40 rounded-xl border border-dashed py-10 text-center text-xs leading-relaxed text-slate-500">
                Hand is empty. Click "Draw 1" or "Reset & Redraw" to add cards.
              </div>
            )}
          </div>

          <div className="bg-dark-surface border-border-dim rounded-2xl border p-5 shadow-md md:p-6">
            <div className="border-border-dim/60 mb-4 flex items-center justify-between border-b pb-3">
              <h4 className="font-display flex items-center gap-2 text-sm font-bold text-white">
                <Layers className="text-cyan-accent h-4 w-4" />
                FIELD
              </h4>
              <span className="text-cyan-accent bg-cyan-accent/10 border-cyan-accent/20 rounded border px-2 py-0.5 text-[10px] font-bold">
                {field.length} Cards
              </span>
            </div>

            {field.length > 0 ? (
              <div className="grid grid-cols-3 gap-3.5 sm:grid-cols-4 md:grid-cols-5">
                {field.map((card) => (
                  <SimulatorCard
                    key={card.uniqId}
                    card={card}
                    currentZone="field"
                    onMove={onMoveCard}
                    onViewDetails={(card: SimulatorCardInstance) => {
                      setInspectedCard(card);
                    }}
                  />
                ))}
              </div>
            ) : (
              <div className="border-border-dim/40 rounded-xl border border-dashed py-12 text-center text-xs text-slate-500">
                Field is empty. Click a card in your hand and select "To Field (Summon)".
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="bg-dark-surface border-border-dim rounded-2xl border p-5 shadow-md">
              <div className="border-border-dim/60 mb-4 flex items-center justify-between border-b pb-3">
                <h4 className="font-display flex items-center gap-2 text-xs font-bold tracking-wider text-white uppercase">
                  <Layers className="h-4 w-4 text-slate-400" />
                  Graveyard (GY)
                </h4>
                <span className="rounded bg-slate-400/10 px-2 py-0.5 text-[9px] font-bold text-slate-400">
                  {graveyard.length} Cards
                </span>
              </div>

              {graveyard.length > 0 ? (
                <div className="grid grid-cols-3 gap-2.5 pr-1 sm:grid-cols-4">
                  {graveyard.map((card) => (
                    <SimulatorCard
                      key={card.uniqId}
                      card={card}
                      currentZone="graveyard"
                      onMove={onMoveCard}
                      onViewDetails={(card: SimulatorCardInstance) => {
                        setInspectedCard(card);
                      }}
                    />
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center text-[11px] text-slate-600">
                  Graveyard is empty.
                </div>
              )}
            </div>

            <div className="bg-dark-surface border-border-dim rounded-2xl border p-5 shadow-md">
              <div className="border-border-dim/60 mb-4 flex items-center justify-between border-b pb-3">
                <h4 className="font-display flex items-center gap-2 text-xs font-bold tracking-wider text-white uppercase">
                  <Layers className="h-4 w-4 text-purple-400" />
                  Banished Zone
                </h4>
                <span className="rounded bg-purple-400/10 px-2 py-0.5 text-[9px] font-bold text-purple-400">
                  {banished.length} Cards
                </span>
              </div>

              {banished.length > 0 ? (
                <div className="grid max-h-55 grid-cols-3 gap-2.5 overflow-y-auto pr-1 sm:grid-cols-4">
                  {banished.map((card) => (
                    <SimulatorCard
                      key={card.uniqId}
                      card={card}
                      currentZone="banished"
                      onMove={onMoveCard}
                      onViewDetails={(card: SimulatorCardInstance) => {
                        setInspectedCard(card);
                      }}
                    />
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center text-[11px] text-slate-600">
                  No cards banished.
                </div>
              )}
            </div>
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

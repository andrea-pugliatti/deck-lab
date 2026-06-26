import { Layers, RotateCcw, Search, Shuffle, Sparkles } from "lucide-react";
import { useState } from "react";
import type { SimulatorCardInstance } from "../../types";
import Button from "../ui/Button";
import CardInspector from "./CardInspector";
import DeckExplorerModal from "./DeckExplorerModal";
import SimulatorCard from "./SimulatorCard";

interface SimulatorWorkspaceProps {
  hand: SimulatorCardInstance[];
  field: SimulatorCardInstance[];
  graveyard: SimulatorCardInstance[];
  banished: SimulatorCardInstance[];
  remainingDeck: SimulatorCardInstance[];
  onDraw: (count: number) => void;
  onShuffle: () => void;
  onReset: (handSize: number) => void;
  onMoveCard: (
    card: SimulatorCardInstance,
    toZone: "hand" | "field" | "graveyard" | "banished" | "deck-top" | "deck-bottom",
  ) => void;
}

export default function SimulatorWorkspace({
  hand,
  field,
  graveyard,
  banished,
  remainingDeck,
  onDraw,
  onShuffle,
  onReset,
  onMoveCard,
}: SimulatorWorkspaceProps) {
  const [handSizeConfig, setHandSizeConfig] = useState<5 | 6>(5);
  const [showDeckExplorer, setShowDeckExplorer] = useState(false);
  const [inspectedCard, setInspectedCard] = useState<SimulatorCardInstance>(hand[0] || undefined);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <CardInspector inspectedCard={inspectedCard} />

      <div className="lg:col-span-9 space-y-6">
        <div className="bg-dark-surface border border-border-dim rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-md">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mr-1">
                Hand Size:
              </span>
              <button
                onClick={() => setHandSizeConfig(5)}
                className={`w-7 h-7 flex items-center justify-center font-mono text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                  handSizeConfig === 5
                    ? "bg-cyan-accent border-cyan-accent text-dark-bg"
                    : "border-border-dim text-slate-400 hover:text-white"
                }`}
              >
                5
              </button>
              <button
                onClick={() => setHandSizeConfig(6)}
                className={`w-7 h-7 flex items-center justify-center font-mono text-xs font-bold rounded-lg border transition-all cursor-pointer ${
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
              <RotateCcw className="w-3.5 h-3.5" />
              Reset & Redraw
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDraw(1)}
              disabled={remainingDeck.length === 0}
              className="flex items-center gap-1.5"
            >
              <Layers className="w-3.5 h-3.5 text-cyan-accent" />
              Draw 1
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onShuffle}
              className="flex items-center gap-1.5"
            >
              <Shuffle className="w-3.5 h-3.5 text-purple-400" />
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
              <Search className="w-3.5 h-3.5 text-dark-bg" />
              Search Deck
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-dark-surface border border-border-dim rounded-2xl p-5 md:p-6 shadow-md">
            <div className="flex justify-between items-center mb-4 border-b border-border-dim/60 pb-3">
              <h4 className="font-display text-sm font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-gold-accent" />
                HAND ZONE
              </h4>
              <span className="text-[10px] font-bold text-gold-accent bg-gold-accent/10 px-2 py-0.5 rounded border border-gold-accent/20">
                {hand.length} Cards
              </span>
            </div>

            {hand.length > 0 ? (
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3.5">
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
              <div className="text-center py-10 border border-dashed border-border-dim/40 rounded-xl text-slate-500 text-xs leading-relaxed">
                Hand is empty. Click "Draw 1" or "Reset & Redraw" to add cards.
              </div>
            )}
          </div>

          <div className="bg-dark-surface border border-border-dim rounded-2xl p-5 md:p-6 shadow-md">
            <div className="flex justify-between items-center mb-4 border-b border-border-dim/60 pb-3">
              <h4 className="font-display text-sm font-bold text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-cyan-accent" />
                FIELD
              </h4>
              <span className="text-[10px] font-bold text-cyan-accent bg-cyan-accent/10 px-2 py-0.5 rounded border border-cyan-accent/20">
                {field.length} Cards
              </span>
            </div>

            {field.length > 0 ? (
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3.5">
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
              <div className="text-center py-12 border border-dashed border-border-dim/40 rounded-xl text-slate-500 text-xs">
                Field is empty. Click a card in your hand and select "To Field (Summon)".
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-dark-surface border border-border-dim rounded-2xl p-5 shadow-md">
              <div className="flex justify-between items-center mb-4 border-b border-border-dim/60 pb-3">
                <h4 className="font-display text-xs font-bold text-white uppercase tracking-wider">
                  Graveyard (GY)
                </h4>
                <span className="text-[9px] font-bold text-slate-400 bg-slate-400/10 px-2 py-0.5 rounded">
                  {graveyard.length} Cards
                </span>
              </div>

              {graveyard.length > 0 ? (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5 max-h-55 overflow-y-auto pr-1">
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
                <div className="text-center py-8 text-slate-600 text-[11px]">
                  Graveyard is empty.
                </div>
              )}
            </div>

            <div className="bg-dark-surface border border-border-dim rounded-2xl p-5 shadow-md">
              <div className="flex justify-between items-center mb-4 border-b border-border-dim/60 pb-3">
                <h4 className="font-display text-xs font-bold text-white uppercase tracking-wider">
                  Banished Zone
                </h4>
                <span className="text-[9px] font-bold text-purple-400 bg-purple-400/10 px-2 py-0.5 rounded">
                  {banished.length} Cards
                </span>
              </div>

              {banished.length > 0 ? (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5 max-h-55 overflow-y-auto pr-1">
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
                <div className="text-center py-8 text-slate-600 text-[11px]">
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
    </div>
  );
}

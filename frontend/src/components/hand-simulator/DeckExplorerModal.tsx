import { Search, X } from "lucide-react";
import { useMemo, useState } from "react";
import type { SimulatorCardInstance } from "../../types";
import Input from "../ui/Input";

interface DeckExplorerModalProps {
  deck: SimulatorCardInstance[];
  setShowDeckExplorer: (flag: boolean) => void;
  handleActionFromExplorer: (
    card: SimulatorCardInstance,
    toZone: "hand" | "field" | "graveyard" | "banished",
  ) => void;
}

export default function DeckExplorerModal({
  deck,
  setShowDeckExplorer,
  handleActionFromExplorer,
}: DeckExplorerModalProps) {
  const [deckSearchQuery, setDeckSearchQuery] = useState("");

  const filteredDeckExplorerCards = useMemo(() => {
    if (!deckSearchQuery.trim()) return deck;
    return deck.filter(
      (c: SimulatorCardInstance) =>
        c.name.toLowerCase().includes(deckSearchQuery.toLowerCase()) ||
        c.type?.toLowerCase().includes(deckSearchQuery.toLowerCase()),
    );
  }, [deck, deckSearchQuery]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in duration-250">
      <div className="bg-dark-surface border border-border-dim w-full max-w-4xl rounded-2xl shadow-2xl flex flex-col max-h-[85vh] relative overflow-hidden">
        <div className="absolute inset-0 bg-radial from-cyan-accent/5 via-transparent to-transparent pointer-events-none"></div>
        <div className="p-5 border-b border-border-dim/60 flex justify-between items-center bg-dark-surface-elevated/40">
          <div>
            <h3 className="font-display text-lg font-bold text-white flex items-center gap-2">
              <Search className="w-5 h-5 text-cyan-accent" />
              SEARCH DECK ({deck.length} CARDS REMAINING)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5 leading-none">
              Simulate searching your deck. Choose a card to move into a game zone.
            </p>
          </div>
          <button
            onClick={() => {
              setDeckSearchQuery("");
              setShowDeckExplorer(false);
            }}
            className="text-slate-400 hover:text-white p-1 rounded-lg bg-dark-surface-elevated hover:bg-slate-800 transition-colors cursor-pointer"
            type="button"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 border-b border-border-dim/30">
          <Input
            type="text"
            placeholder="Search remaining deck cards..."
            value={deckSearchQuery}
            onChange={(e) => setDeckSearchQuery(e.target.value)}
            icon={<Search className="w-4 h-4 text-slate-500" />}
            className="w-full bg-slate-950"
          />
        </div>

        <div className="flex-1 p-6 overflow-y-auto">
          {filteredDeckExplorerCards.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
              {filteredDeckExplorerCards.map((card) => {
                const isMon = card.type?.toLowerCase().includes("monster") || false;
                const isSp = card.type?.toLowerCase().includes("spell") || false;
                const isTr = card.type?.toLowerCase().includes("trap") || false;

                let borderC = "border-slate-500/20";
                if (isSp) borderC = "border-emerald-500/20";
                else if (isTr) borderC = "border-rose-500/20";
                else if (isMon) borderC = "border-amber-500/20";

                return (
                  <div
                    key={card.uniqId}
                    className="flex flex-col gap-2 bg-dark-surface-elevated/20 p-2 rounded-xl border border-border-dim/40 hover:border-cyan-accent/30 transition-all duration-200 group/searchcard"
                  >
                    <div
                      className={`aspect-244/356 w-full rounded-lg overflow-hidden border bg-slate-950 ${borderC}`}
                    >
                      {card.imageUrl ? (
                        <img
                          src={`/api/${card.imageUrl}`}
                          alt={card.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[10px] text-slate-500 p-2 text-center bg-dark-surface-elevated">
                          {card.name}
                        </div>
                      )}
                    </div>

                    {/* Search Card Actions */}
                    <div className="space-y-1">
                      <button
                        onClick={() => {
                          handleActionFromExplorer(card, "hand");
                          setDeckSearchQuery("");
                          setShowDeckExplorer(false);
                        }}
                        className="w-full py-1 text-[10px] font-bold uppercase tracking-wider rounded bg-cyan-accent/10 text-cyan-accent hover:bg-cyan-accent hover:text-dark-bg transition-colors cursor-pointer"
                      >
                        To Hand
                      </button>
                      <button
                        onClick={() => {
                          handleActionFromExplorer(card, "field");
                          setDeckSearchQuery("");
                          setShowDeckExplorer(false);
                        }}
                        className="w-full py-1 text-[10px] font-bold uppercase tracking-wider rounded bg-gold-accent/10 text-gold-accent hover:bg-gold-accent hover:text-dark-bg transition-colors cursor-pointer"
                      >
                        To Field
                      </button>
                      <button
                        onClick={() => {
                          handleActionFromExplorer(card, "graveyard");
                          setDeckSearchQuery("");
                          setShowDeckExplorer(false);
                        }}
                        className="w-full py-1 text-[10px] font-bold uppercase tracking-wider rounded bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors cursor-pointer"
                      >
                        To GY
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16 text-slate-600 text-xs">
              No matching cards remaining in the deck.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

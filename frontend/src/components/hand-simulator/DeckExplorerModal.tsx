import { Search, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import type { SimulatorCardInstance } from "../../types";
import { getCardTheme } from "../../utils/card";
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
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog) {
      if (!dialog.open) {
        dialog.showModal();
      }
      const handleClose = () => {
        setShowDeckExplorer(false);
      };
      dialog.addEventListener("close", handleClose);
      return () => {
        dialog.removeEventListener("close", handleClose);
      };
    }
  }, [setShowDeckExplorer]);

  const filteredDeckExplorerCards = useMemo(() => {
    if (!deckSearchQuery.trim()) return deck;
    return deck.filter(
      (c: SimulatorCardInstance) =>
        c.name.toLowerCase().includes(deckSearchQuery.toLowerCase()) ||
        c.type?.toLowerCase().includes(deckSearchQuery.toLowerCase()),
    );
  }, [deck, deckSearchQuery]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (e.target === dialogRef.current) {
      dialogRef.current?.close();
    }
  };

  return (
    <dialog
      ref={dialogRef}
      onClick={handleBackdropClick}
      className="max-h-[85vh] w-full max-w-4xl overflow-visible border-none bg-transparent p-4 text-white backdrop:bg-black/75 backdrop:backdrop-blur-sm focus:outline-none"
    >
      <div className="bg-dark-surface border-border-dim relative flex max-h-[80vh] w-full flex-col overflow-hidden rounded-2xl border shadow-2xl">
        <div className="from-cyan-accent/5 pointer-events-none absolute inset-0 bg-radial via-transparent to-transparent"></div>

        <div className="border-border-dim/60 bg-dark-surface-elevated/40 flex items-center justify-between border-b p-5">
          <div>
            <h3 className="font-display flex items-center gap-2 text-lg font-bold text-white">
              <Search className="text-cyan-accent h-5 w-5" />
              SEARCH DECK ({deck.length} CARDS REMAINING)
            </h3>
            <p className="mt-0.5 text-xs leading-none text-slate-500">
              Simulate searching your deck. Choose a card to move into a game zone.
            </p>
          </div>
          <button
            onClick={() => {
              setDeckSearchQuery("");
              dialogRef.current?.close();
            }}
            className="bg-dark-surface-elevated cursor-pointer rounded-lg p-1 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
            type="button"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="border-border-dim/30 border-b p-4">
          <Input
            type="text"
            placeholder="Search remaining deck cards..."
            value={deckSearchQuery}
            onChange={(e) => setDeckSearchQuery(e.target.value)}
            icon={<Search className="h-4 w-4 text-slate-500" />}
            className="w-full bg-slate-950"
          />
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {filteredDeckExplorerCards.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 md:grid-cols-6">
              {filteredDeckExplorerCards.map((card) => {
                const { borderColor: borderC } = getCardTheme(card.type);

                return (
                  <div
                    key={card.uniqId}
                    className="bg-dark-surface-elevated/20 border-border-dim/40 hover:border-cyan-accent/30 group/searchcard flex flex-col gap-2 rounded-xl border p-2 transition-all duration-200"
                  >
                    <div
                      className={`aspect-244/356 w-full overflow-hidden rounded-lg border bg-slate-950 ${borderC}`}
                    >
                      {card.imageUrl ? (
                        <img
                          src={`/api/${card.imageUrl}`}
                          alt={card.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="bg-dark-surface-elevated flex h-full w-full items-center justify-center p-2 text-center text-[10px] text-slate-500">
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
                          dialogRef.current?.close();
                        }}
                        className="bg-cyan-accent/10 text-cyan-accent hover:bg-cyan-accent hover:text-dark-bg w-full cursor-pointer rounded py-1 text-[10px] font-bold tracking-wider uppercase transition-colors"
                      >
                        To Hand
                      </button>
                      <button
                        onClick={() => {
                          handleActionFromExplorer(card, "field");
                          setDeckSearchQuery("");
                          dialogRef.current?.close();
                        }}
                        className="bg-gold-accent/10 text-gold-accent hover:bg-gold-accent hover:text-dark-bg w-full cursor-pointer rounded py-1 text-[10px] font-bold tracking-wider uppercase transition-colors"
                      >
                        To Field
                      </button>
                      <button
                        onClick={() => {
                          handleActionFromExplorer(card, "graveyard");
                          setDeckSearchQuery("");
                          dialogRef.current?.close();
                        }}
                        className="w-full cursor-pointer rounded bg-slate-800 py-1 text-[10px] font-bold tracking-wider text-slate-300 uppercase transition-colors hover:bg-slate-700"
                      >
                        To GY
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-16 text-center text-xs text-slate-600">
              No matching cards remaining in the deck.
            </div>
          )}
        </div>
      </div>
    </dialog>
  );
}

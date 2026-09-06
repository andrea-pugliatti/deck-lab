import { Search } from "lucide-react";
import { useState } from "react";

import CardImage from "../../../components/ui/CardImage";
import Input from "../../../components/ui/Input";
import Modal from "../../../components/ui/Modal";
import ModalCloseButton from "../../../components/ui/ModalCloseButton";
import { getCardKind } from "../../../features/cards/utils/cardKind";
import type { SimulatorCardInstance } from "../../../types";

/**
 * Props for the {@link DeckExplorerModal} component.
 */
interface DeckExplorerModalProps {
  deck: SimulatorCardInstance[];
  setShowDeckExplorer: (flag: boolean) => void;
  handleActionFromExplorer: (
    card: SimulatorCardInstance,
    toZone: "hand" | "field" | "graveyard" | "banished",
  ) => void;
}

/**
 * DeckExplorerModal component.
 * Renders a dialog/modal overlay allowing users to search through the remaining
 * cards in their deck and perform actions (e.g. move a card to Hand, Field, or Graveyard).
 *
 * @param props - The component props.
 * @returns A JSX element containing the modal search/exploration dialog.
 */
export default function DeckExplorerModal({
  deck,
  setShowDeckExplorer,
  handleActionFromExplorer,
}: DeckExplorerModalProps) {
  const [deckSearchQuery, setDeckSearchQuery] = useState("");

  const handleClose = () => {
    setDeckSearchQuery("");
    setShowDeckExplorer(false);
  };

  const filteredDeckExplorerCards = !deckSearchQuery.trim()
    ? deck
    : deck.filter(
        (c: SimulatorCardInstance) =>
          c.name.toLowerCase().includes(deckSearchQuery.toLowerCase()) ||
          c.type?.toLowerCase().includes(deckSearchQuery.toLowerCase()),
      );

  return (
    <Modal
      isOpen={true}
      onClose={handleClose}
      size="4xl"
      containerClassName="max-h-[80vh]"
      ariaLabel="Search Deck"
    >
      <div className="from-cyan-accent/5 pointer-events-none absolute inset-0 bg-radial via-transparent to-transparent"></div>

      <div className="border-border-dim/60 bg-dark-surface-elevated/40 flex items-center justify-between border-b p-5">
        <div>
          <h3 className="font-display flex items-center gap-2 text-lg font-bold text-white">
            <Search className="text-cyan-accent size-5" aria-hidden="true" />
            SEARCH DECK ({deck.length} CARDS REMAINING)
          </h3>
          <p className="mt-0.5 text-xs leading-none text-slate-500">
            Simulate searching your deck. Choose a card to move into a game zone.
          </p>
        </div>
        <ModalCloseButton onClick={handleClose} />
      </div>

      <div className="border-border-dim/30 border-b p-4">
        <Input
          type="text"
          placeholder="Search remaining deck cards..."
          value={deckSearchQuery}
          onChange={(e) => setDeckSearchQuery(e.target.value)}
          icon={<Search className="size-4 text-slate-500" />}
          containerClassName="w-full bg-slate-950"
        />
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {filteredDeckExplorerCards.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 md:grid-cols-6">
            {filteredDeckExplorerCards.map((card) => {
              return (
                <div
                  key={card.uniqId}
                  className="bg-dark-surface-elevated/20 border-border-dim/40 hover:border-cyan-accent/30 group/searchcard flex flex-col gap-2 rounded-xl border p-2 transition-all duration-200"
                >
                  <div
                    data-card-kind={getCardKind(card.type)}
                    className="card-frame-border aspect-244/356 w-full overflow-hidden rounded-lg border bg-slate-950"
                  >
                    <CardImage src={card.imageUrl} alt={card.name} />
                  </div>

                  {/* Search Card Actions */}
                  <div className="space-y-1">
                    <button
                      onClick={() => {
                        handleActionFromExplorer(card, "hand");
                        handleClose();
                      }}
                      className="bg-cyan-accent/10 text-cyan-accent hover:bg-cyan-accent hover:text-dark-bg focus-visible:ring-cyan-accent text-2xs w-full cursor-pointer rounded py-1 font-bold tracking-wider uppercase transition-colors focus-visible:ring-1 focus-visible:outline-hidden"
                    >
                      To Hand
                    </button>
                    <button
                      onClick={() => {
                        handleActionFromExplorer(card, "field");
                        handleClose();
                      }}
                      className="bg-gold-accent/10 text-gold-accent hover:bg-gold-accent hover:text-dark-bg focus-visible:ring-gold-accent text-2xs w-full cursor-pointer rounded py-1 font-bold tracking-wider uppercase transition-colors focus-visible:ring-1 focus-visible:outline-hidden"
                    >
                      To Field
                    </button>
                    <button
                      onClick={() => {
                        handleActionFromExplorer(card, "graveyard");
                        handleClose();
                      }}
                      className="focus-visible:ring-cyan-accent text-2xs w-full cursor-pointer rounded bg-slate-800 py-1 font-bold tracking-wider text-slate-300 uppercase transition-colors hover:bg-slate-700 focus-visible:ring-1 focus-visible:outline-hidden"
                    >
                      To GY
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-16 text-center text-xs text-slate-400">
            No matching cards remaining in the deck.
          </div>
        )}
      </div>
    </Modal>
  );
}
